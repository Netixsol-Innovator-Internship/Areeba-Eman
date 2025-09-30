import { StateGraph, Annotation } from '@langchain/langgraph';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { Model } from 'mongoose';
import { Match } from './schemas/match.schema';
import { AIMessage } from "@langchain/core/messages";

export function buildWorkflow(matchModel: Model<Match>) {
  const llm = new ChatGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
    model: 'gemini-2.5-flash',
  });
  
  type MessageContentText = {
    type: "text";
    text: string;
  };
  function parseJsObject(jsString: string): any {
    try {
      // eslint-disable-next-line no-new-func
      return new Function(`return (${jsString});`)();
    } catch (err) {
      console.error("Failed to parse JS object:", jsString, err);
      return {};
    }
  }

  // ✅ Define state schema
  const CricketState = Annotation.Root({
    question: Annotation<string>,
    relevant: Annotation<boolean>,
    mongoQuery: Annotation<string>,
    result: Annotation<any[]>({
      value: (_left, right) => right,
      default: () => [],
    }),
    answer: Annotation<string>,
    error: Annotation<string>,
  });

  // Node 1: Relevancy Checker
  const relevancyChecker = async (state: any) => {
    const q = state.question.toLowerCase();
    if (
      q.includes("cricket") ||
      q.includes("odi") ||
      q.includes("t20") ||
      q.includes("test") ||
      q.includes("score") ||
      q.includes("team") ||
      q.includes("result") ||
      q.includes("ground") ||
      q.includes("match") ||
      q.includes("rpo") ||
      q.includes("run rate")
    ) {
      return { relevant: true };
    }

    // 🚫 If not relevant, skip queryGen/queryExec
    return { relevant: false, answer: "Sorry, I can only answer cricket-related questions." };
};


  // Node 2: Query Generator
    const queryGenerator = async (state: any) => {
    const prompt = `
    You are an expert in MongoDB + Mongoose.
    Convert this cricket question into a **strict JSON query object**.

    ### Schema fields:
    - team
    - opposition
    - score
    - overs
    - rpo
    - lead
    - inns
    - result
    - ground
    - start_date
    - type

    ### Rules:
    - Always include "filter" for normal queries
    - For count queries, return { "countOnly": true, "filter": { ... } }
    - For sorting, return { "filter": {...}, "sort": { field: 1 or -1 } }
    - For limit, return { "filter": {...}, "limit": number }
    - For aggregations, return { "aggregation": true, "pipeline": [ ... ] }
    - Do NOT include any JavaScript, comments, or explanations.
    - Only return pure JSON.
    - For opposition, always include the "v " prefix in the regex (e.g. "v India", "v Pakistan")  
    - Always use case-insensitive regex { "$regex": "...", "$options": "i" } for both 'team' and 'opposition'


    Example:
    Question: "Which team won most matches?"
    {
      "aggregation": true,
      "pipeline": [
        { "$match": { "result": { "$regex": "won" } } },
        { "$group": { "_id": "$team", "wins": { "$sum": 1 } } },
        { "$sort": { "wins": -1 } },
        { "$limit": 1 }
      ]
    }

    Question: ${state.question}
    `;

    const response = (await llm.invoke(prompt)) as AIMessage;

    let text = "";
    if (typeof response.content === "string") text = response.content;
    else if (Array.isArray(response.content)) {
      const part = response.content.find((c): c is { type: "text"; text: string } => c.type === "text");
      if (part) text = part.text;
    }

    // Strip code blocks
    const match = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (match) text = match[1];
    text = text.trim();

    console.log("Sanitized Query JSON:", text);

    let queryObj;
    try {
      queryObj = JSON.parse(text);
    } catch (err) {
      console.error("❌ Failed to parse AI JSON query:", err, text);
      queryObj = {};
    }

    return { mongoQuery: queryObj };
  };


  // Node 3: Query Executor
  const queryExecutor = async (state: any) => {
    const queryObj = state.mongoQuery;

    if (!queryObj || Object.keys(queryObj).length === 0) {
      return { error: "AI-generated query is invalid or empty." };
    }

    try {
      let result;

      // 🔹 Aggregation
      if (queryObj.aggregation) {
        if (!Array.isArray(queryObj.pipeline)) {
          return { error: "Aggregation pipeline missing or invalid." };
        }
        result = await matchModel.aggregate(queryObj.pipeline).exec();
      }

      // 🔹 Count query
      else if (queryObj.countOnly) {
        if (!queryObj.filter) {
          return { error: "Count query requires a filter." };
        }
        result = [{ count: await matchModel.countDocuments(queryObj.filter) }];
      }

      // 🔹 Normal find query
      else if (queryObj.filter) {
        let query = matchModel.find(queryObj.filter)
          .select("team opposition score overs rpo inns result ground start_date type");

        if (queryObj.sort) query = query.sort(queryObj.sort);
        if (queryObj.limit) query = query.limit(queryObj.limit);

        result = await query.exec();
      }

      // ❌ No filter provided
      else {
        return { error: "Normal query requires a filter." };
      }

      console.log("✅ Query Executor Result:", result.length, "docs");
      return { result };

    } catch (err: any) {
      console.error("❌ Query execution error:", err);
      return { error: err.message || "Generated query is invalid or not executable." };
    }
  };





  // Node 4: Answer Formatter
  const answerFormatter = async (state: any) => {
    // Always return a consistent array
    if (state.error) return { answer: [{ error: state.error }] };

    if (!state.result || state.result.length === 0) {
      return { answer: [{ message: "No results found" }] };
    }

    const resultsArray = Array.isArray(state.result) ? state.result : [state.result];
    if (!resultsArray[0] || Object.keys(resultsArray[0]).length === 0) {
      return { answer: [{ message: "No results found" }] };
    }

    // Aggregation result (e.g. wins, group counts)
    if (resultsArray[0]._id !== undefined && resultsArray[0].wins !== undefined) {
      return {
        answer: resultsArray.map((m: any) => ({
          team: m._id,
          wins: m.wins,
        })),
      };
    }

    // Count query
    if (resultsArray[0].count !== undefined) {
      return {
        answer: resultsArray.map((m: any) => ({
          count: m.count,
        })),
      };
    }

    // Normal matches
    return {
      answer: resultsArray.map((m: any) => ({
        team: m.team,
        opposition: m.opposition,
        score: m.score,
        overs: m.overs,
        rpo: m.rpo,
        lead: m.lead,
        innings: m.inns,
        result: m.result,
        ground: m.ground,
        startDate: m.start_date,
        type: m.type,
      })),
    };
  };





  // ✅ Build graph
  const graph = new StateGraph(CricketState)
    .addNode('relevancy', relevancyChecker)
    .addNode('queryGen', queryGenerator)
    .addNode('queryExec', queryExecutor)
    .addNode('formatter', answerFormatter)
    .addEdge('__start__', 'relevancy')
    .addConditionalEdges("relevancy", (state: any) => {
    if (state.relevant) return "queryGen";
    return "formatter";})
    .addEdge('queryGen', 'queryExec')
    .addEdge('queryExec', 'formatter')
    .compile();

  return graph;
}
