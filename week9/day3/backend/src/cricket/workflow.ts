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

    answer: Annotation<any>({
      value: (_left, right) => right ?? null,
      default: () => null
    }), 
    text: Annotation<any>({
      value: (_left, right) => right ?? "",
      default: () => ""
    }),
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
  if (state.error) return { answer: [{ error: state.error }], text: "There was an error." };
  if (!state.result || state.result.length === 0) {
    return { answer: [{ message: "No results found" }], text: "No results found." };
  }

  const resultsArray = Array.isArray(state.result) ? state.result : [state.result];

  let structuredAnswer;

  // Case 1: wins per team
  if (resultsArray[0]?._id !== undefined && resultsArray[0]?.wins !== undefined) {
    structuredAnswer = resultsArray.map((m: any) => ({ team: m._id, wins: m.wins }));
  }

  // Case 2: matches per team
  else if (resultsArray[0]?._id !== undefined && resultsArray[0]?.matches !== undefined) {
    structuredAnswer = resultsArray.map((m: any) => ({ team: m._id, matches: m.matches }));
  }

  // Case 3: count queries
  else if (resultsArray[0]?.count !== undefined) {
    structuredAnswer = resultsArray.map((m: any) => ({ count: m.count }));
  }

  // Case 4: normal documents
  else {
    structuredAnswer = resultsArray.map((m: any) => ({
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
    }));
  }

  // 🔹 Call LLM to generate sentence/table
  const prompt = `
User asked: ${state.question}

Here is the structured result:
${JSON.stringify(structuredAnswer, null, 2)}

Please generate a concise human-readable answer:
- If it's a single record (like "England 919"), turn it into a sentence.
- If it's multiple records, make it a short table or bullet list.
`;

  const llmResponse = await llm.invoke(prompt);
  console.log("structured answer:::", structuredAnswer),
  console.log("text answer::: ", llmResponse.content)
  return {
    ...state,
    answer: structuredAnswer,      // raw structured data (good for UI/tables)
    text: llmResponse.content,     // human-readable sentence
  };
};

//save memory
const saveMemory = async (state: any) => {
  const { userId, chatId, question, answer, text, history } = state;
  // console.log("state::", state)
  console.log("texttst::", text),
  console.log("answerrr::", answer)
  const answerText = text || (typeof answer === "string" ? answer : JSON.stringify(answer));


  const latestHistory = [...history, { question, answer: answerText }].slice(-5);

  const summaryText = latestHistory
    .map(h => `Q: ${h.question} | A: ${h.answer}`)
    .join("\n");

  await summaryModel.findOneAndUpdate(
    { userId, chatId },
    { summary: summaryText },
    { upsert: true }
  );

  console.log("texts state::", text);
  return { ...state, answer, text };
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
