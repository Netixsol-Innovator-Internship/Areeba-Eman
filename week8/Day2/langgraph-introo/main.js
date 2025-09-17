import * as dotenv from "dotenv";
dotenv.config()

import { ChatGoogleGenerativeAI} from '@langchain/google-genai'
import { StateGraph, MessagesAnnotation } from '@langchain/langgraph';
import readline from 'readline';

const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: 'gemini-1.5-flash'
});

const callModel = async(state) => {
    try{
        const response = await model.invoke(state.messages);
        return{messages: [ response ] }
    }
    catch(err){
        console.error("this is the error:", err.message);
        return{ messages: [{ role: "system", content: "Error"+ err.message}]};
    }
}

const graph = new StateGraph(MessagesAnnotation)
.addNode("chatbot", callModel)
.addEdge("__start__", "chatbot")

const app = graph.compile();

const rl = readline.createInterface({
    input : process.stdin,
    output: process.stdout
})

console.log("Areeba's Chatbot started, You may ask anything or type 'exit' to leave");

async function ask(state = {
    messages: [{ role: "system", content: "You are a helpfull AI"}]
}) {
     rl.question("You: ", async(input) => {
        if(input.toLowerCase() === "exit"){
            rl.close();
            return;
        }
        const newState = await app.invoke({
            messages: [...state.messages, {role: "user", content: input}],
        });

        const lastMessage = newState.messages[newState.messages.length - 1];

        let aitext = Array.isArray(lastMessage.content)
        ? lastMessage.content.map(c => c.text).join(" ")
        : lastMessage.content;


        console.log("AI", aitext);

        ask(newState);
     } )
}

ask();