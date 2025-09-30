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
  model: "gemini-2.5-flash",
});

// ====== Nodes ======

// 1. Question Splitter
async function QuestionSplitter(state: any) {
  const prompt = `Break down this question into 3-4 smaller questions:\n${state.question}`;
  const res = await llm.invoke(prompt);

  let text: string;
  if (Array.isArray(res.content)) {
    text = res.content.map((c: any) => (typeof c === "string" ? c : c.text)).join("\n");
  } else {
    text = res.content as string;
  }

  const subQs = text.split("\n").filter(Boolean);
  const trace = [...(state.trace || []), { step: "QuestionSplitter", output: subQs }];
  return { ...state, subquestions: subQs, trace };
}

// 2. Document Finder
async function DocumentFinder(state: any) {
  const found: any[] = [];
  for (const q of state.subquestions || []) {
    const docs = await DocumentModel.find({
      content: { $regex: q.split(" ")[0], $options: "i" },
    }).limit(3);
    found.push(...docs);
  }
  const trace = [...(state.trace || []), { step: "DocumentFinder", output: found }];
  return { ...state, foundDocs: found, trace };
}

// 3. Ranker (TF-IDF)
async function Ranker(state: any) {
  const TfIdf = natural.TfIdf;
  const tfidf = new TfIdf();

  (state.foundDocs || []).forEach((doc: any) => tfidf.addDocument(doc.content));

  const scores = (state.foundDocs || []).map((doc: any, i: number) => {
    let score = 0;
    (state.subquestions || []).forEach((q: string) => {
      tfidf.tfidfs(q, (j, val) => { if (i === j) score += val; });
    });
    return { doc, score };
  });

  const ranked = scores.sort((a, b) => b.score - a.score).map((s) => s.doc);
  const trace = [...(state.trace || []), { step: "Ranker", output: ranked }];
  return { ...state, rankedDocs: ranked, trace };
}

// 4. Summarizer (TextRank)
async function Summarizer(state: any) {
  let TextRank: any;
  try {
    const TextRankModule = await import("textrank");
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
        return doc.content.slice(0, 200);
      }
    } catch (err) {
      console.error("TextRank error:", err);
      return doc.content.slice(0, 200);
    }
  });

  const trace = [...(state.trace || []), { step: "Summarizer", output: summaries }];
  return { ...state, summaries, trace };
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
  const trace = [...(state.trace || []), { step: "CrossChecker", output: contradictions }];
  return { ...state, contradictions, trace };
}

// 6. Final Answer Maker
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
    text = res.content.map((c: any) => (typeof c === "string" ? c : c.text)).join("\n");
  } else if (typeof res.content === "string") {
    text = res.content;
  }

  const trace = [...(state.trace || []), { step: "FinalAnswerMaker", output: text }];
  return { ...state, finalAnswer: text, trace };
}

// ===== Workflow Wiring =====
const schema = {
  question: Annotation<string>(),
  subquestions: Annotation<string[]>(),
  foundDocs: Annotation<any[]>(),
  rankedDocs: Annotation<any[]>(),
  summaries: Annotation<string[]>(),
  contradictions: Annotation<string[]>(),
  finalAnswer: Annotation<string>(),
  trace: Annotation<any[]>(), // add trace to schema
};

const GraphState = Annotation.Root(schema);

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

export const app = workflow.compile();

// ===== Optional: standalone run function for trace =====
export async function runWorkflow(question: string) {
  const initial = { question, trace: [] };
  const result = await app.invoke(initial);
  return { finalAnswer: result.finalAnswer, trace: result.trace || [] };
}
//extra not being used