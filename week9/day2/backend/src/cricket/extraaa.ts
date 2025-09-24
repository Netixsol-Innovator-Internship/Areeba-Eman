import { StateGraph, Annotation } from '@langchain/langgraph';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { Model } from 'mongoose';
import { Match } from './schemas/match.schema';
import { AIMessage } from "@langchain/core/messages";

export function buildWorkflow(matchModel: Model<Match>) {
  const llm = new ChatGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
    model: 'gemini-1.5-flash',
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
      Convert this cricket question into a valid Mongoose query on the "matches" collection.

      ### Schema fields:
      - team (✅ the home team)
      - opposition (✅ always stored as "v X", e.g., "v India", "v England")
      - score
      - overs
      - rpo
      - lead
      - inns
      - result
      - ground
      - start_date
      - type (stored in lowercase: "odi", "test", "t20")

      ### Rules:
      - Always use matchModel (not db.collection).
      - Always end with .exec().
      - "home team" → filter on 'team'.
      - "away team" or "opponent" → filter on 'opposition'.
      - For opposition values, **always include 'v '** prefix (e.g., "v India").
      - For match type (ODI/T20/Test), always use lowercase ("odi", "t20", "test").
      - For "latest" → sort by { start_date: -1 }.
      - For "earliest" → sort by { start_date: 1 }.
      - For "highest" or "top" → sort appropriately and include .limit(1).
      - For "lowest" → sort ascending and include .limit(1).
      - If a count is requested → use .countDocuments().

      ❌ Do NOT return plain JSON.
      ❌ Do NOT return Mongo shell syntax.
      ✅ Always return a valid JavaScript Mongoose query.

      Question: ${state.question}

      Example outputs:
      matchModel.find({ team: "England" }).sort({ start_date: -1 }).limit(1).exec()
      matchModel.find({ opposition: "v India" }).countDocuments().exec()
      matchModel.find().sort({ rpo: -1 }).limit(1).exec()
    `;

    const response = (await llm.invoke(prompt)) as AIMessage;
    console.log("Gemini raw output:", response);

    let text = "";
    if (typeof response.content === "string") {
      text = response.content;
    } else if (Array.isArray(response.content)) {
      const part = response.content.find(
        (c): c is MessageContentText => c.type === "text"
      );
      if (part) {
        text = part.text;
      }
    }

    // ✅ Extract code block
    const match = text.match(/```(?:js|javascript)?\s*([\s\S]*?)```/i);
    if (match) text = match[1];

    // ✅ Clean up
    text = text.replace(/\/\/.*$/gm, "");
    text = text.replace(/\\n/g, "\n");
    text = text.replace(/^await\s+/, "");
    text = text.trim();

    console.log("Sanitized Query:", text);
    return { mongoQuery: text };
};


// Node 3: Query Executor
  const queryExecutor = async (state: any) => {
    const rawQuery = state.mongoQuery;
    console.log("Generated Query:", rawQuery);

    try {
      let findCondition: any = {};
      const isFindOne = /findOne\(/.test(rawQuery);

      // Extract find object safely
      const findMatch = rawQuery.match(/\{([\s\S]*?)\}/);
      if (findMatch) {
        // Convert key: value pairs safely
        const jsObjString = "({" + findMatch[1] + "})";
        findCondition = eval(jsObjString); // Only if AI output is trusted
      }

      // Normalize opposition
      if (findCondition.opposition && typeof findCondition.opposition === "string") {
        if (!findCondition.opposition.startsWith("v ")) {
          findCondition.opposition = "v " + findCondition.opposition;
        }
      }

      // Normalize type
      if (findCondition.type && typeof findCondition.type === "string") {
        findCondition.type = findCondition.type.toLowerCase();
      }

      if (findCondition.$or && Array.isArray(findCondition.$or)) {
        findCondition.$or = findCondition.$or.map((cond: any) => {
          if (cond.opposition && !cond.opposition.startsWith('v ')) {
            cond.opposition = 'v ' + cond.opposition;
          }
          return cond;
        });
      }


      // Normalize score as string
      if (findCondition.score !== undefined) {
        findCondition.score = findCondition.score.toString();
      }

      if (Object.keys(findCondition).length === 0) {
        return { error: "AI-generated query is invalid or empty. Cannot fetch data." };
      }

      let query = isFindOne
        ? matchModel.findOne(findCondition)
        : matchModel.find(findCondition);
      query = query.select('team opposition score overs rpo lead inns result ground start_date type');

      const result = await query.exec();
      console.log("result from db:::", result)
      return { result };
    } catch (err: any) {
      console.error("Query execution error:", err);
      return { error: "Generated query is invalid or not executable." };
    }
  };





// Node 4: Answer Formatter
    const answerFormatter = async (state: any) => {
      if (state.error) return { answer: "Error: " + state.error };
      if (!state.result) return { answer: "No data found." };

      // Normalize: wrap single object in array
      const resultsArray = Array.isArray(state.result) ? state.result : [state.result];

      if (resultsArray.length === 0) {
        return { answer: "No data found." };
      }

      // If exactly one result → show all fields
      if (resultsArray.length === 1) {
        const m = resultsArray[0];
        return {
          answer: `
    Team: ${m.team}
    Opposition: ${m.opposition}
    Score: ${m.score}
    Overs: ${m.overs}
    RPO: ${m.rpo}
    Lead: ${m.lead}
    Innings: ${m.inns}
    Result: ${m.result}
    Ground: ${m.ground}
    Start Date: ${m.start_date}
    Type: ${m.type}
    `.trim(),
        };
      }

      // Multiple results → table view
      const header = "Team |Score | Overs | RPO | Opposition | Ground | Type | Result";
      const rows = resultsArray
        .map(
          (m) =>
            `${m.team} | ${m.score} | ${m.overs} | ${m.rpo} | ${m.opposition} | ${m.ground} | ${m.type} | ${m.result}`
        )
        .join("\n");

      return { answer: `${header}\n${rows}` };
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
