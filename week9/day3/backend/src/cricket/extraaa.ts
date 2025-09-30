import { StateGraph, Annotation } from '@langchain/langgraph';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { Model } from 'mongoose';
import { Match } from './schemas/match.schema';
import { Conversation } from 'src/conversation/schema/conversation.schema';
import { Summary } from 'src/summary/schema/summary.schema';

export function buildWorkflow(
  matchModel: Model<Match>,
  conversationModel: Model<Conversation>,
  summaryModel: Model<Summary>,
) {
  const llm = new ChatGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
    model: 'gemini-2.5-flash',
  });

  // 🔹 Define State
  const CricketState = Annotation.Root({
    userId: Annotation<string>,
    chatId: Annotation<string>,
    question: Annotation<string>,

    history: Annotation<{ question: string; answer: string }[]>({
      value: (_left, right) => right,
      default: () => [],
    }),

    summary: Annotation<string>({
      value: (_left, right) => right,
      default: () => "",
    }),

    relevant: Annotation<boolean>,
    mongoQuery: Annotation<any>(), // was string, fixed to any

    result: Annotation<any[]>({
      value: (_left, right) => right,
      default: () => [],
    }),

    answer: Annotation<any>(), // was string, fixed to any
    error: Annotation<string>,
  });

  // 🔹 Node 1: Load Memory
  const loadMemory = async (state: any) => {
    const { userId, chatId } = state;

    const historyDocs = await conversationModel
      .find({ userId, chatId })
      .sort({ createdAt: 1 })
      .select('question answer -_id');

    const summaryDoc = await summaryModel.findOne({ userId, chatId });

    return {
      history: historyDocs.map((d: any) => ({
        question: d.question,
        // ensure answer is string
        answer: typeof d.answer === "string" ? d.answer : JSON.stringify(d.answer),
      })),
      summary: summaryDoc ? summaryDoc.summary : '',
    };
  };

  // 🔹 Node 2: Relevancy Checker
  const relevancyChecker = async (state: any) => {
    const q = (state.question || "").toLowerCase();
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
    return { relevant: false, answer: "Sorry, I can only answer cricket-related questions." };
  };

  // 🔹 Node 3: Query Generator
    const queryGenerator = async (state: any) => {
  const lastQ = state.history.length ? state.history[state.history.length - 1].question : "";

  const prompt = `
You are an expert in MongoDB + Mongoose.
Convert the user's cricket question into a **strict JSON MongoDB query**.

### Schema fields
- team, opposition, score, overs, rpo, lead, inns, result, ground, start_date, type

### Context
- Current question: "${state.question}"
- Previous question: "${lastQ}"

### Rules
- If the current question is follow-up ("and what about...", "what about odi?"), reuse missing entities from the previous question.
- Always use { "$regex": "...", "$options": "i" } for text matching.
- For "played X matches" → use count query.
+ For "how many matches <team> played (optionally with <opposition> / in <format>)" → use { "countOnly": true } with filter.
+ For "which team played most matches?" → use aggregation with $group on "$team", $sort descending, $limit 1.
+ For "which team played less/least matches?" → use aggregation with $group on "$team", $sort ascending, $limit 1.
+ For "which teams played least matches with each other?" → use aggregation with $group on { team: "$team", opposition: "$opposition" }, $sort ascending, $limit 1.
- For "most/least matches" → always group by team and use { "$sum": 1 } as "matches".
  - If the question says "which team played less matches?" → use aggregation with $group on **"$team"**.
  - If the question says "which teams played least matches with each other?" → use aggregation with $group on **{ team: "$team", opposition: "$opposition" }**.
  - Never insert $project before $group
- For opposition, always prefix with "v " (e.g. "v India").
- Do not add duplicate $project stages.
- Only output pure JSON.

Example:
Question: "Which team won most matches?"
{
  "aggregation": true,
  "pipeline": [
    { "$match": { "result": { "$regex": "won", "$options": "i" } } },
    { "$group": { "_id": "$team", "wins": { "$sum": 1 } } },
    { "$sort": { "wins": -1 } },
    { "$limit": 1 }
  ]
}
    Question: ${state.question}
    `;

    const response = await llm.invoke(prompt);

    let text = "";
    if (typeof response.content === "string") text = response.content;
    else if (Array.isArray(response.content)) {
      const part = response.content.find(
        (c: any): c is { type: "text"; text: string } => c.type === "text"
      );
      if (part) text = part.text;
    }

    const match = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (match) text = match[1];
    text = text.trim();

    let queryObj;
    try {
      queryObj = JSON.parse(text);
    } catch {
      console.error("❌ Failed to parse AI JSON query:", text);
      queryObj = {};
    }
    console.log("querygeneratir:::", JSON.stringify(queryObj, null, 2) )
    return { mongoQuery: queryObj };
  };

  // 🔹 Node 4: Query Executor
    const queryExecutor = async (state: any) => {
      let queryObj = state.mongoQuery;

      if (!queryObj || Object.keys(queryObj).length === 0) {
        return { error: "AI-generated query is invalid or empty." };
      }

      // 🔹 Fallback: detect most/least matches and build aggregation if LLM messed up
      const q = (state.question || "").toLowerCase();
      if (!queryObj.aggregation && !queryObj.countOnly) {
        if (q.includes("most matches")) {
          queryObj = {
            aggregation: true,
            pipeline: [
              { $group: { _id: "$team", matches: { $sum: 1 } } },
              { $sort: { matches: -1 } },
              { $limit: 1 }
            ]
          };
        } else if (q.includes("less matches") || q.includes("least matches")) {
          queryObj = {
            aggregation: true,
            pipeline: [
              { $group: { _id: "$team", matches: { $sum: 1 } } },
              { $sort: { matches: 1 } },
              { $limit: 1 }
            ]
          };
        }
      }

      try {
        let result;

        // // 🔹 Aggregation
        if (queryObj.aggregation) {
      result = await matchModel.aggregate(queryObj.pipeline).exec();
      console.log("✅ Query Executor Result:", result);
      if (queryObj.pipeline.some((s: any) => s.$limit === 1)) {
        return { result };
      }
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

        else {
          return { error: "Normal query requires a filter." };
        }
        return { result };

      } catch (err: any) {
        console.error("❌ Query execution error:", err);
        return { error: err.message || "Generated query is invalid or not executable." };
      }
    };



  // 🔹 Node 5: Answer Formatter
  const answerFormatter = async (state: any) => {
  if (state.error) return { answer: [{ error: state.error }] };
  if (!state.result || state.result.length === 0) {
    return { answer: [{ message: "No results found" }] };
  }

  const resultsArray = Array.isArray(state.result) ? state.result : [state.result];

  // 🏆 Case 1: wins per team
  if (resultsArray[0]?._id !== undefined && resultsArray[0]?.wins !== undefined) {
    return { answer: resultsArray.map((m: any) => ({ team: m._id, wins: m.wins })) };
  }

  // 🏆 Case 2: matches per team (your current query)
  if (resultsArray[0]?._id !== undefined && resultsArray[0]?.matches !== undefined) {
    return { answer: resultsArray.map((m: any) => ({ team: m._id, matches: m.matches })) };
  }

  // 🏆 Case 3: count queries
  if (resultsArray[0]?.count !== undefined) {
    return { answer: resultsArray.map((m: any) => ({ count: m.count })) };
  }

  // 🏆 Case 4: normal documents
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


  // 🔹 Node 6: Save Memory
  const saveMemory = async (state: any) => {
    const { userId, chatId, question, answer, history } = state;

    const answerText = typeof answer === "string" ? answer : JSON.stringify(answer);

    await conversationModel.create({ userId, chatId, question, answer: answerText });

    const latestHistory = [...history, { question, answer: answerText }].slice(-5);
    const summaryText = latestHistory
      .map(h => `Q: ${h.question} | A: ${h.answer}`)
      .join('\n');

    await summaryModel.findOneAndUpdate(
      { userId, chatId },
      { summary: summaryText },
      { upsert: true }
    );

    return {};
  };

  // 🔹 Graph Build
  const graph = new StateGraph(CricketState)
    .addNode('loadMemory', loadMemory)
    .addNode('relevancy', relevancyChecker)
    .addNode('queryGen', queryGenerator)
    .addNode('queryExec', queryExecutor)
    .addNode('formatter', answerFormatter)
    .addNode('saveMemory', saveMemory)

    .addEdge('__start__', 'loadMemory')
    .addEdge('loadMemory', 'relevancy')
    .addConditionalEdges('relevancy', (state: any) => state.relevant ? 'queryGen' : 'formatter')
    .addEdge('queryGen', 'queryExec')
    .addEdge('queryExec', 'formatter')
    .addEdge('formatter', 'saveMemory')
    .addEdge('saveMemory', '__end__') 
    .compile();

  return graph;
}

/////////////////////////////////////////////////////////////////////////
// import { StateGraph, Annotation } from '@langchain/langgraph';
// import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
// import { Model } from 'mongoose';
// import { Match } from './schemas/match.schema';
// import { AIMessage } from "@langchain/core/messages";

// export function buildWorkflow(matchModel: Model<Match>) {
//   const llm = new ChatGoogleGenerativeAI({
//     apiKey: process.env.GEMINI_API_KEY,
//     model: 'gemini-1.5-flash',
//   });
  
//   type MessageContentText = {
//     type: "text";
//     text: string;
//   };
//   function parseJsObject(jsString: string): any {
//     try {
//       // eslint-disable-next-line no-new-func
//       return new Function(`return (${jsString});`)();
//     } catch (err) {
//       console.error("Failed to parse JS object:", jsString, err);
//       return {};
//     }
//   }

//   // ✅ Define state schema
//   const CricketState = Annotation.Root({
//     question: Annotation<string>,
//     relevant: Annotation<boolean>,
//     mongoQuery: Annotation<string>,
//     result: Annotation<any[]>({
//       value: (_left, right) => right,
//       default: () => [],
//     }),
//     answer: Annotation<string>,
//     error: Annotation<string>,
//   });

//   // Node 1: Relevancy Checker
//   const relevancyChecker = async (state: any) => {
//     const q = state.question.toLowerCase();
//     if (
//       q.includes("cricket") ||
//       q.includes("odi") ||
//       q.includes("t20") ||
//       q.includes("test") ||
//       q.includes("score") ||
//       q.includes("team") ||
//       q.includes("result") ||
//       q.includes("ground") ||
//       q.includes("match") ||
//       q.includes("rpo") ||
//       q.includes("run rate")
//     ) {
//       return { relevant: true };
//     }

//     // 🚫 If not relevant, skip queryGen/queryExec
//     return { relevant: false, answer: "Sorry, I can only answer cricket-related questions." };
// };
//   // Node 2: Query Generator

// const queryGenerator = async (state: any) => {
//   const prompt = `
//   You are an expert in MongoDB + Mongoose. 
//   Convert this cricket question into a **single JSON describing a query** that can be executed safely.

//   ### Schema fields:
//   - team
//   - opposition
//   - score
//   - overs
//   - rpo
//   - lead
//   - inns
//   - result
//   - ground
//   - start_date
//   - type

//   ### Instructions:
//   - For count queries, set "countOnly": true
//   - For sorting, use "sort": { field: 1 or -1 }
//   - For limit, set "limit": number
//   - For aggregation like "most wins", return "aggregation": true and provide pipeline array
//   - **Do NOT return JS code, loops, console.log, .then, or .exec()**
//   - Only return a **JSON object** like below:

//   Example for "Which team won most matches?":
//   {
//     "aggregation": true,
//     "pipeline": [
//       { "$match": { "result": { "$regex": "won" } } },
//       { "$group": { "_id": "$team", "wins": { "$sum": 1 } } },
//       { "$sort": { "wins": -1 } },
//       { "$limit": 1 }
//     ]
//   }

//   Question: ${state.question}
//   `;

//   const response = (await llm.invoke(prompt)) as AIMessage;

//   // extract text as before
//   let text = "";
//   if (typeof response.content === "string") text = response.content;
//   else if (Array.isArray(response.content)) {
//     const part = response.content.find((c): c is { type: "text"; text: string } => c.type === "text");
//     if (part) text = part.text;
//   }

//   // remove ``` blocks
//   const match = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
//   if (match) text = match[1];

//   text = text.trim();
//   console.log("Sanitized Query JSON:", text);

//   // safely parse JSON
//   let queryObj;
//   try {
//     queryObj = JSON.parse(text);
//   } catch (err) {
//     console.error("Failed to parse AI JSON query:", err, text);
//     queryObj = {};
//   }

//   return { mongoQuery: queryObj };
// };



// // Node 3: Query Executor
// const queryExecutor = async (state: any) => {
//   const queryObj = state.mongoQuery;
//   if (!queryObj || Object.keys(queryObj).length === 0) {
//     return { error: "AI-generated query is invalid or empty." };
//   }

//   try {
//     let result;
//     if (queryObj.aggregation) {
//       // execute aggregation pipeline
//       result = await matchModel.aggregate(queryObj.pipeline).exec();
//     } else if (queryObj.countOnly) {
//       result = [{ count: await matchModel.countDocuments(queryObj.filter) }];
//     } else {
//       let query = matchModel.find(queryObj.filter).select('team opposition score overs rpo lead inns result ground start_date type');
//       if (queryObj.sort) query = query.sort(queryObj.sort);
//       if (queryObj.limit) query = query.limit(queryObj.limit);
//       result = await query.exec();
//     }

//     return { result };
//   } catch (err: any) {
//     console.error("Query execution error:", err);
//     return { error: "Generated query is invalid or not executable." };
//   }
// };



// // Node 4: Answer Formatter
// const answerFormatter = async (state: any) => {
//   if (state.error) return { answer: { error: state.error } };
//   if (!state.result || state.result.length === 0) return { answer: [] };

//   const resultsArray = Array.isArray(state.result) ? state.result : [state.result];

//   // Check type of first item to know how to map
//   if (resultsArray[0]._id && resultsArray[0].wins !== undefined) {
//     // Aggregation like most wins
//     return {
//       answer: resultsArray.map((m: any) => ({
//         team: m._id,
//         wins: m.wins,
//       })),
//     };
//   } else if (resultsArray[0].count !== undefined) {
//     // Count query
//     return {
//       answer: resultsArray.map((m: any) => ({
//         count: m.count,
//       })),
//     };
//   } else {
//     // Normal matches
//     return {
//       answer: resultsArray.map((m: any) => ({
//         team: m.team,
//         opposition: m.opposition,
//         score: m.score,
//         overs: m.overs,
//         rpo: m.rpo,
//         lead: m.lead,
//         innings: m.inns,
//         result: m.result,
//         ground: m.ground,
//         startDate: m.start_date,
//         type: m.type,
//       })),
//     };
//   }
// };




//   // ✅ Build graph
//   const graph = new StateGraph(CricketState)
//     .addNode('relevancy', relevancyChecker)
//     .addNode('queryGen', queryGenerator)
//     .addNode('queryExec', queryExecutor)
//     .addNode('formatter', answerFormatter)
//     .addEdge('__start__', 'relevancy')
//     .addConditionalEdges("relevancy", (state: any) => {
//     if (state.relevant) return "queryGen";
//     return "formatter";})
//     .addEdge('queryGen', 'queryExec')
//     .addEdge('queryExec', 'formatter')
//     .compile();

//   return graph;
// }
