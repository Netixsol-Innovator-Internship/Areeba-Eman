import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Summary } from './schema/summary.schema';

@Injectable()
export class SummariesService {
  constructor(
    @InjectModel(Summary.name) private summaryModel: Model<Summary>,
  ) {}

  //  Create a new summary
  async createSummary(userId: string, chatId: string, summaryText: string): Promise<Summary> {
    const summary = new this.summaryModel({
      userId: new Types.ObjectId(userId),
      chatId,
      summary: summaryText,
    });
    return summary.save();
  }

  // Update summary for a chat
  async updateSummary(userId: string, chatId: string, summaryText: string): Promise<Summary> {
    const summary = await this.summaryModel.findOneAndUpdate(
      { userId: new Types.ObjectId(userId), chatId },
      { summary: summaryText },
      { new: true, upsert: true }, // create if not exists
    );

    return summary;
  }

  // Get all summaries for a user
  async getSummaries(userId: string): Promise<Summary[]> {
    return this.summaryModel.find({ userId: new Types.ObjectId(userId) }).exec();
  }

  //  Get one summary by chatId
  async getSummaryByChat(userId: string, chatId: string): Promise<Summary> {
    const summary = await this.summaryModel.findOne({
      userId: new Types.ObjectId(userId),
      chatId,
    });
    if (!summary) throw new NotFoundException('Summary not found');
    return summary;
  }

  //  Delete a summary
  async deleteSummary(userId: string, chatId: string): Promise<void> {
    await this.summaryModel.deleteOne({ userId: new Types.ObjectId(userId), chatId }).exec();
  }
}
