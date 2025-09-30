import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Match } from './schemas/match.schema';
import { Conversation } from 'src/conversation/schema/conversation.schema';
import { Summary } from 'src/summary/schema/summary.schema';
import { Readable } from 'stream';
import csvParser from 'csv-parser';
// import { Conversation } from 'src/conversation/schemas/conversation.schema';
import { buildWorkflow } from "./workflow";

@Injectable()
export class CricketService {
  private workflow;
  constructor(
    @InjectModel(Match.name) private matchModel: Model<Match>,
    @InjectModel(Conversation.name) private conversationModel: Model<Conversation>,
    @InjectModel(Summary.name) private summaryModel: Model<Summary>,
  ) {
    this.workflow = buildWorkflow(this.matchModel, this.conversationModel, this.summaryModel);
  }

  async uploadCSV(file: Express.Multer.File, type: string) {
    return new Promise((resolve, reject) => {
      const results: any[] = [];

      Readable.from(file.buffer)
        .pipe(csvParser())
        .on('data', (row) => {
          results.push({
            team: row['Team'],
            score: row['Score'],
            overs: row['Overs'],
            rpo: row['RPO'],
            lead: row['Lead'],
            inns: row['Inns'],
            result: row['Result'],
            opposition: row['Opposition'],
            ground: row['Ground'],
            start_date: row['Start Date'],
            type, // add type (test/odi/t20)
          });
        })
        .on('end', async () => {
          await this.matchModel.insertMany(results);
          resolve({ message: `${results.length} records uploaded for ${type}` });
        })
        .on('error', reject);
    });
  }


async ask(userId: string, chatId: string, question: string) {
  try {
    let history: Conversation[] = [];
    let summary = '';

    const chatExists = await this.conversationModel.exists({ userId: new Types.ObjectId(userId), chatId });

    if (chatExists) {
      // 🟢 Chat exists: fetch history and summary
      history = await this.conversationModel
        .find({ userId: new Types.ObjectId(userId), chatId })
        .sort({ createdAt: 1 })
        .lean()
        .exec();

      const summaryDoc = await this.summaryModel.findOne({ userId: new Types.ObjectId(userId), chatId });
      summary = summaryDoc ? summaryDoc.summary : '';
    } else {
      // 🟢 Chat does NOT exist: create it
      const newChat = new this.conversationModel({
        userId: new Types.ObjectId(userId),
        chatId,
        messages: [],
      });
      await newChat.save();
    }

    // 🟢 Call workflow
    const response = await this.workflow.invoke({
      question,
      history,
      summary,
      userId,
      chatId,
    });

    const answer = response?.answer ?? 'No answer found.';
    const text = response?.text ?? '';

    console.log("answer from service", answer);
    console.log("text from service", text);

    // 🟢 Return both
    return { answer, text, history, summary, chatId };
  } catch (err) {
    console.error('Error in ask():', err);
    return { answer: 'Error while processing your question.', text: '', history: [], summary: '', chatId };
  }
}





  // --- Optional: for frontend calls ---
  async getHistory(userId: string, chatId: string) {
    return this.conversationModel
      .find({ userId, chatId })
      .sort({ createdAt: 1 })
      .exec();
  }

  async getSummary(userId: string, chatId: string) {
    return this.summaryModel.findOne({ userId, chatId }).exec();
  }
}
