import { Controller, Post, Body, UseGuards, Req, UseInterceptors, BadRequestException, Query, Param } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { Model, Types } from 'mongoose';
import { CricketService } from './cricket.service';
import {  UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConversationsService } from 'src/conversation/conversation.service';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/user.schema';

@Controller('cricket')
export class CricketController {
  constructor(private readonly cricketService: CricketService,
    private readonly ConversationsService: ConversationsService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCSV(
    @UploadedFile() file: Express.Multer.File,
    @Body('type') type: string, // 'test' | 'odi' | 't20'
  ) {
    return this.cricketService.uploadCSV(file, type);
  }

 
  // @UseGuards(JwtAuthGuard)
  // @Post('/ask')
  // async askQuestion(
  //   @Req() req,
  //   @Body() body: { question: string; chatId: string }
  // ) {
  //   console.log("body:",body.question, body.chatId)

  //   const userId = req.user.id;
  //   console.log("userID",userId)
  //   const result = await this.cricketService.ask(userId, body.chatId, body.question);
  //   return {
  //     answer: result.answer ?? 'No data found.',
  //     history: result.history,
  //     summary: result.summary,
  //   };
  // }
@UseGuards(JwtAuthGuard)
@Post('/ask')
  async askQuestion(
    @Req() req,
    @Body('chatId') chatId: string,
    @Body('question') question: string,
  ) {
    const userId = req.user.userId.toString();
    console.log("chatId:",chatId);
    if (!question || !question.trim()) {
      throw new BadRequestException('Question cannot be empty.');
    }

    try {
      let isNewChat = false;

      if (!chatId) {
        console.log("chat id not found with::",chatId)
        chatId = new Types.ObjectId().toString();
        isNewChat = true;
      }

      const result = await this.cricketService.ask(userId, chatId, question);
      console.log("result:",result)

      await this.ConversationsService.saveMessage(
        userId,
        chatId,
        question,
        result.answer ?? 'No answer found.'
      );


      return {
        answer: result.answer ?? 'No data found.',
        text: result.text ?? '',
        history: result.history,
        summary: result.summary,
        chatId,
      };
    } catch (err: any) {
      console.error(err);
      if (err.status === 429) {
        return { answer: 'Quota exceeded for Gemini API. Please try again later.' };
      }
      return { answer: 'Error processing question.' };
    }
  }

}
