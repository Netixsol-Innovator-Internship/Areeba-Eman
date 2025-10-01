import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Conversation } from './schema/conversation.schema';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectModel(Conversation.name) private conversationModel: Model<Conversation>,
  ) {}

  async createChatIfNotExists(userId: string, chatId: string): Promise<Conversation> {
    let conversation = await this.conversationModel.findOne({
      userId: new Types.ObjectId(userId),
      chatId,
    });

    if (!conversation) {
      conversation = new this.conversationModel({
        userId: new Types.ObjectId(userId),
        chatId,
        messages: [],
      });
      await conversation.save();
    }

    return conversation;
  }


  // ✅ Save a new message into existing chat
async saveMessage(
  userId: string,
  chatId: string,
  question: string,
  answer: any,
): Promise<Conversation> {
  const objectUserId = userId.toString();

  const conversation = await this.conversationModel.findOneAndUpdate(
    { userId: objectUserId, chatId },
    {
      $push: {
        messages: {
          question,
          answer,
          createdAt: new Date(),
        },
      },
    },
    { new: true }
  );

  if (!conversation) {
    throw new NotFoundException('Chat not found. Please create a chat first.');
  }

  return conversation;
}




  // ✅ Get all chats for a user (just chat list, not all messages)
  async getChats(userId: string): Promise<Conversation[]> {
    return this.conversationModel
      .find({ userId: userId.toString() })
      .select('chatId createdAt updatedAt') // only metadata
      .sort({ updatedAt: -1 })
      .exec();
  }

  // ✅ Get full chat history by chatId
  async getChatHistory(userId: string, chatId: string): Promise<Conversation> {
    const chat = await this.conversationModel.findOne({
      userId: userId.toString(),
      chatId,
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    return chat;
  }

  // ✅ Delete a single chat
  async deleteChat(userId: string, chatId: string): Promise<void> {
    await this.conversationModel.deleteOne({
      userId: userId.toString(),
      chatId,
    });
  }

  // ✅ Delete ALL chats for a user
  async clearChats(userId: string): Promise<void> {
    await this.conversationModel.deleteMany({ userId: userId.toString() });
  }
}
