// import { Injectable } from '@nestjs/common';
// import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
// import { StateGraph, Annotation } from '@langchain/langgraph';
// import {
//   BaseMessage,
//   HumanMessage,
//   AIMessage,
//   SystemMessage,
// } from '@langchain/core/messages';
// import { ProductsService } from '../products/products.service';
// import { ChatState } from './chat.state';

// function extractTextFromMessage(message: BaseMessage): string {
//   if (typeof message.content === 'string') {
//     return message.content;
//   }
//   if (Array.isArray(message.content)) {
//     return message.content.map((c: any) => c.text ?? '').join(' ');
//   }
//   return '';
// }

// @Injectable()
// export class ChatService {
//   private sessions = new Map<string, BaseMessage[]>();

//   private model = new ChatGoogleGenerativeAI({
//     apiKey: process.env.GEMINI_API_KEY,
//     model: 'gemini-2.5-flash',
//   });

//   constructor(private readonly productsService: ProductsService) {}

//   async sendMessage(chatId: string, message: string) {
//     try {
//       const ChatAnnotation = Annotation.Root({
//         systemMessage: Annotation<SystemMessage>(),
//         messages: Annotation<BaseMessage[]>(),
//         intent: Annotation<string | undefined>(),
//         explanation: Annotation<string | undefined>(),
//       });

//       // Ensure system message exists in chat history
//       if (!this.sessions.has(chatId)) {
//         this.sessions.set(chatId, [
//           new SystemMessage(
//             `You are a healthcare shopping assistant. 
//              Your job is to understand the user's health needs 
//              and recommend suitable healthcare products from our store. 
//              - Always start with a short natural explanation about how the product type supports the user's condition.
//              - Then, if matching products are available, list them clearly (name + price).
//              - If no products match, just give the explanation without suggesting medical treatments.
//              - Never give medical advice, diagnoses, or prescribe treatments.`
//           ),
//         ]);
//       }

//       const history = this.sessions.get(chatId)!;
//       history.push(new HumanMessage(message));

//       const state: ChatState = {
//         systemMessage: history[0] as SystemMessage,
//         messages: history.slice(1),
//       };

//       // --- Nodes ---
//       const intentDetector = async (state: ChatState) => {
//         try {
//           console.log('Running intentDetector...');
          
//           // Dedicated SystemMessage for classification only.
//           // No state.systemMessage to avoid multiple SystemMessages.
//           const classifierSystemMsg = new SystemMessage(
//             `You are an intent classifier for a healthcare shopping assistant.
//              Classify the LAST user message in the conversation into one of:
//              - "product_search": if they want/need health support and might benefit from product recommendations (e.g., mentioning a health issue like vitamin deficiency or weak bones).
//              - "chat": if it’s just small talk, general info, or unrelated to health products.
//              Reply ONLY with one label (e.g., "product_search"). Do not explain or add extra text.`
//           );

//           // Use full history for context (or slice(-1) for latest message only).
//           const response = await this.model.invoke([classifierSystemMsg, ...state.messages]);
//           console.log('Intent detector response:', response);

//           return { intent: extractTextFromMessage(response).trim().toLowerCase() };
//         } catch (err) {
//           console.error('Error in intentDetector:', err);
//           throw err;
//         }
//       };

//       const chatbot = async (state: ChatState) => {
//         try {
//           console.log('Running chatbot...');
//           // Uses the main systemMessage, which is correct.
//           const response = await this.model.invoke([state.systemMessage, ...state.messages]);
//           console.log('Chatbot response:', response);
//           return { messages: [response] };
//         } catch (err) {
//           console.error('Error in chatbot:', err);
//           throw err;
//         }
//       };

//       const explanation = async (state: ChatState) => {
//         try {
//           console.log('Running explanation...');
          
//           // Dedicated SystemMessage for explanation generation.
//           // Incorporates key rules from main system prompt for consistency.
//           // No state.systemMessage to avoid multiple SystemMessages.
//           const explainerSystemMsg = new SystemMessage(
//             `You are a healthcare shopping assistant.
//              Based on the user's health concern in the conversation, provide a short natural explanation about how certain types of healthcare products might support the user's condition.
//              - Make it natural, supportive, and easy to understand.
//              - Do not list actual product names or prices here—only the general explanation.
//              - If no products match, this explanation stands alone.
//              - Never give medical advice, diagnoses, or prescribe treatments.
//              -try making the reply short`
//           );

//           const response = await this.model.invoke([explainerSystemMsg, ...state.messages]);
//           console.log('Explanation response:', response);
//           return { explanation: extractTextFromMessage(response) };
//         } catch (err) {
//           console.error('Error in explanation:', err);
//           throw err;
//         }
//       };

//       const productSearch = async (state: ChatState) => {
//         try {
//           console.log('Running productSearch...');
//           const lastMsg = state.messages[state.messages.length - 1];
//           const userMsg = extractTextFromMessage(lastMsg);

//           const searchResult = await this.productsService.aiSearch(userMsg);

//           let explanationText = state.explanation ?? 'No specific explanation available.';
//           let productsText = '';

//           if (!searchResult || searchResult.products.length === 0) {
//             productsText = 'No matching products found at this time.';
//           } else {
//             // Format products separately (clean list with single header).
//             // Assuming flat array from aiSearch. If categorized, see optional code below.
//             productsText = 'Here are some suggestions:\n';
//             searchResult.products.forEach((p) => {
//               productsText += `- ${p.name} (${p.price}$)\n`;
//             });

//             // OPTIONAL: If aiSearch returns categories (e.g., { categories: { multivitamins: Product[], calcium: Product[] } }),
//             // uncomment and adapt for per-category sections:
//             /*
//             productsText = '';
//             const categories = searchResult.categories || {};
//             for (const [category, prods] of Object.entries(categories)) {
//               if (prods.length > 0) {
//                 productsText += `\n**${category}**\n`;
//                 prods.forEach((p) => {
//                   productsText += `- ${p.name} (${p.price}$)\n`;
//                 });
//               }
//             }
//             if (!productsText) {
//               productsText = 'No matching products found at this time.';
//             } else {
//               productsText = 'Here are some suggestions:' + productsText;
//             }
//             */
//           }

//           // Return SEPARATE messages for explanation and products.
//           // LangGraph will append both to state.messages (two AI "turns").
//           const explanationMsg = new AIMessage(explanationText);
//           const productsMsg = new AIMessage(productsText);

//           return { 
//             messages: [explanationMsg, productsMsg],
//             explanation: explanationText,  // Keep for state if needed
//           };
//         } catch (err) {
//           console.error('Error in productSearch:', err);
//           throw err;
//         }
//       };

//       // --- Graph ---
//       const graph = new StateGraph(ChatAnnotation)
//         .addNode('intentDetector', intentDetector)
//         .addNode('chatbot', chatbot)
//         .addNode('generateExplanation', explanation)
//         .addNode('productSearch', productSearch)
//         .addEdge('__start__', 'intentDetector')
//         .addConditionalEdges('intentDetector', (state) => {
//           return state.intent === 'product_search' ? 'generateExplanation' : 'chatbot';
//         })
//         .addEdge('generateExplanation', 'productSearch')
//         .addEdge('chatbot', '__end__')
//         .addEdge('productSearch', '__end__');

//       const app = graph.compile();

//       console.log('Invoking StateGraph with state:', state);
//       const result = await app.invoke(state);

//       // Extract explanation and products separately based on intent.
//       let explanationai = '';
//       let products = '';
//       let aiReplyText = '';  // Now populated for BOTH intents

//       if (result.intent === 'product_search') {
//         // Last two messages: explanation + products (from productSearch).
//         const messages = result.messages as AIMessage[];
//         if (messages.length >= 2) {
//           explanationai = extractTextFromMessage(messages[messages.length - 2]);
//           products = extractTextFromMessage(messages[messages.length - 1]);

//           // NEW: Also set aiReplyText as combined for full response in 'reply' field.
//           aiReplyText = `${explanationai}\n\n${products}`;

//           // Push SEPARATE messages to history (granular).
//           history.push(new AIMessage(explanationai));
//           history.push(new AIMessage(products));
//         }
//       } else {
//         // For chat: Single message.
//         const lastMsg = result.messages[result.messages.length - 1] as AIMessage;
//         aiReplyText = extractTextFromMessage(lastMsg);
//         history.push(new AIMessage(aiReplyText));
//       }

//       console.log('AI Explanation:', explanationai);
//       console.log('AI Products:', products);
//       console.log('AI Reply (full/combined):', aiReplyText);  // Updated log name for clarity

//       // Return SEPARATE fields + full reply for compatibility.
//       return { 
//         explanationai, 
//         products, 
//         reply: aiReplyText,  // Now has full content for product_search too
//         history 
//       };
//     } catch (err) {
//       console.error('Error in sendMessage:', err);
//       throw err;
//     }
//   }

//   resetChat(chatId: string) {
//     this.sessions.delete(chatId);
//   }
// }
