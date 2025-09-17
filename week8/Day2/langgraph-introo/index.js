// import * as dotenv from "dotenv";
// dotenv.config()

// import { ChatGoogleGenerativeAI} from '@langchain/google-genai'
// import { StateGraph, MessagesAnnotation } from '@langchain/langgraph';
// import readline from 'readline';

// const model = new ChatGoogleGenerativeAI({
//   apiKey: process.env.GEMINI_API_KEY,
//   model: 'gemini-1.5-flash'
// });

// const callModel = async(state) => {
//     try{
//         const response = await model.invoke(state.messages);
//         return{messages: [ response ] }
//     }
//     catch(err){
//         console.error("this is the error:", err.message);
//         return{ messages: [{ role: "system", content: "Error"+ err.message}]};
//     }
// }

// const graph = new StateGraph(MessagesAnnotation)
// .addNode("chatbot", callModel)
// .addEdge("__start__", "chatbot")

// const app = graph.compile();

// const rl = readline.createInterface({
//     input : process.stdin,
//     output: process.stdout
// })

// console.log("Areeba's Chatbot started, You may ask anything or type 'exit' to leave");

// async function ask(state = {
//     messages: [{ role: "system", content: "You are a helpfull AI"}]
// }) {
//      rl.question("You: ", async(input) => {
//         if(input.toLowerCase() === "exit"){
//             rl.close();
//             return;
//         }
//         const newState = await app.invoke({
//             messages: [...state.messages, {role: "user", content: input}],
//         });

//         const lastMessage = newState.messages[newState.messages.length - 1];

//         let aitext = Array.isArray(lastMessage.content)
//         ? lastMessage.content.map(c => c.text).join(" ")
//         : lastMessage.content;


//         console.log("AI", aitext);

//         ask(newState);
//      } )
// }

// ask();
import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-1.5-flash",
});

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await model.invoke([
      { role: "system", content: "You are a cute and helpful AI assistant." },
      { role: "user", content: userMessage },
    ]);

    const text =
      Array.isArray(response.content)
        ? response.content.map((c) => c.text).join(" ")
        : response.content;

    res.json({ reply: text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Error: " + err.message });
  }
});

app.listen(3000, () =>
  console.log("🌸 Server running at http://localhost:3000")
);
