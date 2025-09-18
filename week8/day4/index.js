import * as dotenv from "dotenv";
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import readline from "readline";

// --- Gemini Chat Node ---
const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-1.5-flash"
});

// --- Create Graph ---
const graph = new StateGraph({
  channels: { messages: MessagesAnnotation }
});

// --- Router Node --- this adds routernode in graph it returns the current state and then branching
// decide which node to take
graph.addNode("router", async (state) => state);

// --- Chat Node ---
graph.addNode("chat", async (state) => { 
  const res = await model.invoke(state.messages);   //model. invode gives the model chat history 
  return { messages: [res] };   //returns new state with ai response 
});

// --- Calculator Node ---
graph.addNode("calculator", async (state) => {
  const lastMessage = state.messages[state.messages.length - 1].content;  //get users input
  try {
    const result = eval(lastMessage);  //eval calculates the math results
    return { messages: [{ role: "tool", content: `Answer: ${result}` }] }; //returns the result with tool
  } catch {
    return { messages: [{ role: "tool", content: "Invalid math expression." }] };
  }
});

// --- Branching Logic ---
graph.addConditionalEdges("router", (state) => {   //decide where to test the input
  const input = state.messages[state.messages.length - 1].content; 
  const isMath = /^[0-9+\-*/().\s]+$/.test(input);  //check if the input is only math symbols
  console.log("Routing decision:", isMath ? "calculator 🧮" : "chat 🧠");
  return isMath ? "calculator" : "chat";  //returns the node name to router
});


// connest the starting point to router and input starts with __start__ goes to router
graph.addEdge("__start__", "router");

// --- Compile Graph ---
const app = graph.compile();     //prepares for execution

// --- CLI Loop ---   just for cli
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

async function main() {
  console.log("Chatbot ready! Type your message (or math expression).");
  while (true) {
    const input = await new Promise((r) => rl.question("> ", r));
    const result = await app.invoke({ messages: [{ role: "user", content: input }] });
    console.log(result.messages[result.messages.length - 1].content);
  }
}

await main();
