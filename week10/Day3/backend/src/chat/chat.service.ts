import { Injectable } from '@nestjs/common';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { Annotation, StateGraph } from '@langchain/langgraph';
import {
  BaseMessage,
  HumanMessage,
  AIMessage,
  SystemMessage,
} from '@langchain/core/messages';
import { ProductsService } from '../products/products.service';
import { ChatState } from './chat.state';

function extractTextFromMessage(message: BaseMessage): string {
  if (typeof message.content === 'string') return message.content;
  if (Array.isArray(message.content)) {
    return message.content.map((c: any) => c.text ?? '').join(' ');
  }
  return '';
}

@Injectable()
export class ChatService {
  private sessions = new Map<string, BaseMessage[]>();

  private model = new ChatGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
    model: 'gemini-2.5-flash',
  });

  constructor(private readonly productsService: ProductsService) {}

  async sendMessage(chatId: string, message: string) {
    console.log(`📩 New user message [${chatId}]:`, message);

    const ChatAnnotation = Annotation.Root({
        systemMessage: Annotation<SystemMessage>(),
        messages: Annotation<BaseMessage[]>(),
        intent: Annotation<string | undefined>(),
        explanation: Annotation<string | undefined>(),
        products: Annotation<any[]>(), // ✅ keep array tracked
      });

    // ✅ Init system message
    if (!this.sessions.has(chatId)) {
      console.log(`🆕 Starting new session for chatId: ${chatId}`);
      this.sessions.set(chatId, [
        new SystemMessage(
          `You are a healthcare shopping assistant. 
           Your job is to understand the user's health needs 
           and recommend suitable healthcare products from our store.
           - Always start with a short natural explanation.
           - If matching products are available, list them (name + price).
           - If no products match, only give the explanation.
           - Never give medical advice or prescriptions.`
        ),
      ]);
    }

    const history = this.sessions.get(chatId)!;
    history.push(new HumanMessage(message));

    const state: ChatState = {
      systemMessage: history[0] as SystemMessage,
      messages: history.slice(1),
    };

    // --- Nodes ---
    const intentDetector = async (state: ChatState) => {
      console.log('🧭 Running intentDetector...');
      const classifier = new SystemMessage(
        `Classify the LAST user message as:
         - "product_search"
         - "chat"`
      );
      const response = await this.model.invoke([classifier, ...state.messages]);
      const intent = extractTextFromMessage(response).trim().toLowerCase();
      console.log('✅ Detected intent:', intent);
      return { intent };
    };

    const chatbot = async (state: ChatState) => {
      console.log('💬 Running chatbot...');
      const response = await this.model.invoke([state.systemMessage, ...state.messages]);
      console.log('🤖 Chatbot raw response:', response);
      return { messages: [response] };
    };

    const explanation = async (state: ChatState) => {
      console.log('📖 Generating explanation...');
      const explainer = new SystemMessage(
        `Give a short natural explanation about healthcare product types. 
         - No specific product names/prices.
         - No medical advice.`
      );
      const response = await this.model.invoke([explainer, ...state.messages]);
      const text = extractTextFromMessage(response);
      console.log('📢 Explanation:', text);
      return { explanation: text };
    };

    const productSearch = async (state: ChatState) => {
      console.log('🔎 Running productSearch...');
      const lastHuman = [...state.messages].reverse().find(m => m instanceof HumanMessage);
      const userMsg = lastHuman ? extractTextFromMessage(lastHuman) : '';
      console.log('🔍 Searching products for query:', userMsg);

      const searchResult = await this.productsService.aiSearch(userMsg);
      console.log('🛒 Raw product searchResult:', searchResult);

      let productsText = searchResult?.products?.length
        ? searchResult.products.map(p => `- ${p.name} (${p.price}$)`).join('\n')
        : 'No matching products found.';

      return { 
        products: searchResult?.products ?? [], 
        messages: [new AIMessage(state.explanation ?? ''), new AIMessage(productsText)],
        explanation: state.explanation
      };
    };

    // --- Graph ---
    const graph = new StateGraph(ChatAnnotation)
      .addNode('intentDetector', intentDetector)
      .addNode('chatbot', chatbot)
      .addNode('generateExplanation', explanation)
      .addNode('productSearch', productSearch)
      .addEdge('__start__', 'intentDetector')
      .addConditionalEdges('intentDetector', (state) =>
        state.intent === 'product_search' ? 'generateExplanation' : 'chatbot'
      )
      .addEdge('generateExplanation', 'productSearch')
      .addEdge('chatbot', '__end__')
      .addEdge('productSearch', '__end__');

    console.log('⚡ Invoking graph with state...');
    const app = graph.compile();
    const result = await app.invoke(state);
    console.log('📦 Graph result:', result);

    // --- Final parsing ---
    let explanationai = result.explanation ?? '';
    let products = result.products ?? [];
    let aiReplyText = '';

    if (result.intent === 'product_search') {
      aiReplyText = explanationai;
      history.push(new AIMessage(aiReplyText));
      console.log('✅ Final product response prepared');
    } else {
      const lastMsg = result.messages.at(-1) as AIMessage;
      aiReplyText = extractTextFromMessage(lastMsg);
      history.push(new AIMessage(aiReplyText));
      console.log('✅ Final chat response prepared');
    }

    console.log('🤖 AI Reply:', aiReplyText);
    console.log('📊 Products returned:', products.length);

    return { explanationai, products, reply: aiReplyText, history };
  }

  resetChat(chatId: string) {
    console.log(`♻️ Resetting chat session for chatId: ${chatId}`);
    this.sessions.delete(chatId);
  }
}
