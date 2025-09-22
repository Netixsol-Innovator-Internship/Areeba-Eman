import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import * as natural from "natural";
// import TextRank from "textrank"; 
import mongoose from "mongoose";
import { DocumentSchema } from "../schemas/document.schema";
import { StateGraph, Annotation } from "@langchain/langgraph";


// ===== DB Model =====
const DocumentModel = mongoose.model("Document", DocumentSchema);


// ===== LLM Setup =====
const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY!,
  model: "gemini-1.5-flash",
});

// console.log("api key::::", process.env.GEMINI_API_KEY!)


// ====== Nodes ======

// 1. Question Splitter (LLM)

async function QuestionSplitter(state: any) {
  const prompt = `Break down this question into 3-4 smaller questions:\n${state.question}`;
  const res = await llm.invoke(prompt);

  // Handle both array or string responses
  let text: string;
  if (Array.isArray(res.content)) {
    text = res.content.map((c: any) => (typeof c === "string" ? c : c.text)).join("\n");
  } else {
    text = res.content as string;
  }

  const subQs = text.split("\n").filter(Boolean);
  console.log("1:QuestionSplitter → subQs:", subQs);
  return { ...state, subquestions: subQs };
}



// 2. Document Finder (MongoDB)
async function DocumentFinder(state: any) {
  const found: any[] = [];
  for (const q of state.subquestions || []) {
    const docs = await DocumentModel.find({
      content: { $regex: q.split(" ")[0], $options: "i" },
    }).limit(3);
    found.push(...docs);
  }
  console.log("2: Document finder:::", found)
  return { ...state, foundDocs: found };
}

// 3. Ranker (TF-IDF)
async function Ranker(state: any) {
  const TfIdf = natural.TfIdf;
  const tfidf = new TfIdf();

  (state.foundDocs || []).forEach((doc: any) => {
    tfidf.addDocument(doc.content);
  });

  const scores = (state.foundDocs || []).map((doc: any, i: number) => {
    let score = 0;
    (state.subquestions || []).forEach((q: string) => {
      tfidf.tfidfs(q, (j, val) => {
        if (i === j) score += val;
      });
    });
    console.log("3: ranker:::", score)
    return { doc, score };
  });

  const ranked = scores.sort((a, b) => b.score - a.score).map((s) => s.doc);
  return { ...state, rankedDocs: ranked };
}

// 4. Summarizer (TextRank)
async function Summarizer(state: any) {
  let TextRank: any;
  try {
    const TextRankModule = await import("textrank");
    // TextRank may be default or a named export
    TextRank = TextRankModule.default || TextRankModule.TextRank || TextRankModule;
  } catch (err) {
    console.error("Failed to import TextRank:", err);
  }

  const summaries = (state.rankedDocs || []).map((doc: any) => {
    try {
      if (typeof TextRank === "function") {
        const summaryArray = TextRank(doc.content, 2) || [];
        return summaryArray.length ? summaryArray.join(" ") : doc.content.slice(0, 200);
      } else {
        // fallback if TextRank isn’t callable
        return doc.content.slice(0, 200);
      }
    } catch (err) {
      console.error("TextRank error:", err);
      return doc.content.slice(0, 200);
    }
  });

  console.log("4: summarize:::", summaries);
  return { ...state, summaries };
}



// 5. CrossChecker
async function CrossChecker(state: any) {
  const contradictions: string[] = [];
  if (state.summaries && state.summaries.length > 1) {
    for (let i = 0; i < state.summaries.length; i++) {
      for (let j = i + 1; j < state.summaries.length; j++) {
        if (
          state.summaries[i].includes("better") &&
          state.summaries[j].includes("better")
        ) {
          contradictions.push(
            `Possible contradiction between doc ${i + 1} and doc ${j + 1}`
          );
        }
      }
    }
  }
  console.log("5: cross check:::", contradictions );
  return { ...state, contradictions };
}

// 6. Final Answer Maker (LLM)
async function FinalAnswerMaker(state: any) {
  const prompt = `You are a research assistant.
Question: ${state.question}
Sub-questions: ${state.subquestions}
Summaries: ${state.summaries}
Contradictions: ${state.contradictions}

Write a clear final answer with context.`;

  const res = await llm.invoke(prompt);

  let text = "";
  if (Array.isArray(res.content)) {
    // map array items
    text = res.content
      .map((c: any) => (typeof c === "string" ? c : c.text))
      .join("\n");
  } else if (typeof res.content === "string") {
    text = res.content;
  }

  console.log("6: final:::", text);
  return { ...state, finalAnswer: text };
}


// ===== Workflow Wiring =====

// 1. Define schema with Annotation
const schema = {
  question: Annotation<string>(), // add question so it flows through
  subquestions: Annotation<string[]>(),
  foundDocs: Annotation<any[]>(),
  rankedDocs: Annotation<any[]>(),
  summaries: Annotation<string[]>(),
  contradictions: Annotation<string[]>(),
  finalAnswer: Annotation<string>(),
};

// 2. Wrap schema with Root
const GraphState = Annotation.Root(schema);

// 3. Build the graph
export const workflow = new StateGraph(GraphState)
  .addNode("QuestionSplitter", QuestionSplitter)
  .addNode("DocumentFinder", DocumentFinder)
  .addNode("Ranker", Ranker)
  .addNode("Summarizer", Summarizer)
  .addNode("CrossChecker", CrossChecker)
  .addNode("FinalAnswerMaker", FinalAnswerMaker)
  .addEdge("__start__", "QuestionSplitter")
  .addEdge("QuestionSplitter", "DocumentFinder")
  .addEdge("DocumentFinder", "Ranker")
  .addEdge("Ranker", "Summarizer")
  .addEdge("Summarizer", "CrossChecker")
  .addEdge("CrossChecker", "FinalAnswerMaker")
  .addEdge("FinalAnswerMaker", "__end__");
// 4. Compile into runnable app



//extra totally extra
export async function runWorkflow(question: string) {
  const logs: any[] = [];

  // Wrapper to capture logs
  const log = (step: string, output: any) => {
    logs.push({ step, output });
    console.log(step, output); // keep backend logs
  };

  // Initial state
  let state: any = { question };

  // Run each workflow node and capture outputs
  state = await QuestionSplitter(state).then(s => { log("QuestionSplitter", s.subquestions); return s; });
  state = await DocumentFinder(state).then(s => { log("DocumentFinder", s.foundDocs); return s; });
  state = await Ranker(state).then(s => { log("Ranker", s.rankedDocs); return s; });
  state = await Summarizer(state).then(s => { log("Summarizer", s.summaries); return s; });
  state = await CrossChecker(state).then(s => { log("CrossChecker", s.contradictions); return s; });
  state = await FinalAnswerMaker(state).then(s => { log("FinalAnswerMaker", s.finalAnswer); return s; });

  return { finalAnswer: state.finalAnswer, logs };
}
//till here


export const app = workflow.compile();






// controller:

// import { Controller, Post, Body } from '@nestjs/common';
// import { app } from './research.workflow';
// import { ResearchState } from './research.state';
// import mongoose from 'mongoose';
// import { DocumentSchema, ResearchDoc } from '../schemas/document.schema';
// import { runWorkflow } from "./research.workflow";

// // Register model once
// const DocumentModel = mongoose.model<ResearchDoc>("Document", DocumentSchema);

// @Controller("research")
// export class ResearchController {
//   @Post("ask")
//   async ask(@Body() body: { question: string }) {
//     const initial: ResearchState = { question: body.question, trace: [] }; // initialize trace
//     const result = await app.invoke(initial);

//     // Send both finalAnswer and step-by-step trace
//     return {
//       finalAnswer: result.finalAnswer,
//       trace: result.trace || [],
//     };
//   }

//   // 🚀 Upload a document into MongoDB
//   @Post("upload")
//   async upload(@Body() body: { title: string; topic: string; content: string }) {
//     const doc = new DocumentModel({
//       title: body.title,
//       topic: body.topic,
//       content: body.content,
//     });
//     await doc.save();
//     return { message: "✅ Document uploaded", id: doc._id };
//   }
// }
