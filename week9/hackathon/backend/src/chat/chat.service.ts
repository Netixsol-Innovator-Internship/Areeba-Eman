import { Injectable } from '@nestjs/common';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { StateGraph, Annotation } from '@langchain/langgraph';
import {
  BaseMessage,
  HumanMessage,
  AIMessage,
  SystemMessage,
} from '@langchain/core/messages';
import { ProductsService } from '../products/products.service';
import { ChatState } from './chat.state';

function extractTextFromMessage(message: BaseMessage): string {
  if (typeof message.content === 'string') {
    return message.content;
  }
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
    try {
      const ChatAnnotation = Annotation.Root({
        systemMessage: Annotation<SystemMessage>(),
        messages: Annotation<BaseMessage[]>(),
        intent: Annotation<string | undefined>(),
        explanation: Annotation<string | undefined>(),
        products: Annotation<any[]>(), // ✅ keep array tracked
      });

      // Ensure system message exists in chat history
      if (!this.sessions.has(chatId)) {
        this.sessions.set(chatId, [
          new SystemMessage(
            `You are a healthcare shopping assistant. 
             Your job is to understand the user's health needs 
             and recommend suitable healthcare products from our store. 
             - Always start with a short natural explanation about how the product type supports the user's condition.
             - Then, if matching products are available, list them clearly (name + price).
             - If no products match, just give the explanation without suggesting medical treatments.
             - Never give medical advice, diagnoses, or prescribe treatments.`
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
        console.log('Running intentDetector...');
        const classifierSystemMsg = new SystemMessage(
          `You are an intent classifier for a healthcare shopping assistant.
           Classify the LAST user message in the conversation into one of:
           - "product_search"
           - "chat"
           Reply ONLY with one label.`
        );

        const response = await this.model.invoke([classifierSystemMsg, ...state.messages]);
        const intent = extractTextFromMessage(response).trim().toLowerCase();
        console.log('Intent detector response:', intent);
        return { intent };
      };

      const chatbot = async (state: ChatState) => {
        console.log('Running chatbot...');
        const response = await this.model.invoke([state.systemMessage, ...state.messages]);
        console.log('Chatbot response:', response);
        return { messages: [response] };
      };

      const explanation = async (state: ChatState) => {
        console.log('Running explanation...');
        const explainerSystemMsg = new SystemMessage(
          `You are a healthcare shopping assistant.
           Provide a short natural explanation about how certain types of healthcare products might support the user's condition.
           - Do not list actual product names or prices.
           - Never give medical advice, diagnoses, or prescribe treatments.
           - Keep it short.`
        );

        const response = await this.model.invoke([explainerSystemMsg, ...state.messages]);
        const explanation = extractTextFromMessage(response);
        console.log('Explanation response:', explanation);
        return { explanation };
      };

      const productSearch = async (state: ChatState) => {
  console.log("Running productSearch...");

  // ✅ Make sure we extract last human message only
  const lastHuman = [...state.messages].reverse().find(m => m instanceof HumanMessage);
  const userMsg = lastHuman ? extractTextFromMessage(lastHuman) : "";

  console.log("Searching products for query:", userMsg);

  const searchResult = await this.productsService.aiSearch(userMsg);

  console.log("Raw searchResult from aiSearch:", searchResult);

  let explanationText = state.explanation ?? 'No specific explanation available.';
  let productsText = '';

  if (!searchResult || searchResult.products.length === 0) {
    productsText = 'No matching products found at this time.';
  } else {
    productsText = 'Here are some suggestions:\n';
    searchResult.products.forEach((p) => {
      productsText += `- ${p.name} (${p.price}$)\n`;
    });
  }
 //extracted explanation and products text
  console.log("ProductsText for AI message:", productsText);

  const explanationMsg = new AIMessage(explanationText);
  const productsMsg = new AIMessage(productsText);

  return { 
    messages: [explanationMsg, productsMsg],
    explanation: explanationText,
    products: searchResult.products,  // ✅ keep array here
  };
};


      // --- Graph ---
      const graph = new StateGraph(ChatAnnotation)
        .addNode('intentDetector', intentDetector)
        .addNode('chatbot', chatbot)
        .addNode('generateExplanation', explanation)
        .addNode('productSearch', productSearch)
        .addEdge('__start__', 'intentDetector')
        .addConditionalEdges('intentDetector', (state) => {
          return state.intent === 'product_search' ? 'generateExplanation' : 'chatbot';
        })
        .addEdge('generateExplanation', 'productSearch')
        .addEdge('chatbot', '__end__')
        .addEdge('productSearch', '__end__');

      const app = graph.compile();

      console.log('Invoking StateGraph with state:', state);
      const result = await app.invoke(state);
      console.log('Graph result:', result);

      // Extract explanation and products separately based on intent.
      let explanationai = '';
      let aiReplyText = '';
      let products: any[] = [];

      if (result.intent === 'product_search') {
        const messages = result.messages as AIMessage[];
        if (messages.length >= 2) {
          explanationai = extractTextFromMessage(messages[messages.length - 2]);
          const productsText = extractTextFromMessage(messages[messages.length - 1]);

          aiReplyText = `${explanationai}\n\n${productsText}`;
          products = result.products ?? [];

          console.log('Final extracted explanation:', explanationai);
          console.log('Final extracted products array:', products);

          history.push(new AIMessage(explanationai));
          history.push(new AIMessage(productsText));
        }
      } else {
        const lastMsg = result.messages[result.messages.length - 1] as AIMessage;
        aiReplyText = extractTextFromMessage(lastMsg);
        history.push(new AIMessage(aiReplyText));
      }

      console.log('AI Reply (combined):', aiReplyText);

      return { 
        explanationai, 
        products,
        reply: aiReplyText,
        history 
      };
    } catch (err) {
      console.error('Error in sendMessage:', err);
      throw err;
    }
  }

  resetChat(chatId: string) {
    this.sessions.delete(chatId);
  }
}
