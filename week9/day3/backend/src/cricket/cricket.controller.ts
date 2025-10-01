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

  @UseGuards(JwtAuthGuard)
  @Post('/ask')
  async askQuestion(
  @Req() req,
  @Body('chatId') chatId: string,
  @Body('question') question: string,
) {
  const userId = req.user.userId;

  if (!question?.trim()) {
    throw new BadRequestException('Question cannot be empty.');
  }

  // 🟢 Ensure chat exists here (single place)
  if (!chatId) {
    chatId = new Types.ObjectId().toString();
  }
  await this.ConversationsService.createChatIfNotExists(userId, chatId);

  // 🟢 Call service
  const result = await this.cricketService.ask(userId, chatId, question);
let answerToSave;

// if it's an array and more than 1 element → table (save as is)
if (Array.isArray(result.answer) && result.answer.length > 1) {
  answerToSave = result.answer;
}
// if it's an array with only 1 object → treat it as a "simple" answer → save LLM text
else if (Array.isArray(result.answer) && result.answer.length === 1) {
  answerToSave = result.text;  
}
// if it's not an array at all → just save text
else {
  answerToSave = result.text ?? 'No answer found.';
}

await this.ConversationsService.saveMessage(
  userId,
  chatId,
  question,
  answerToSave,
);


  return {
    answer: result.answer ?? 'No data found.',
    text: result.text ?? '',
    history: result.history,
    summary: result.summary,
    chatId,
  };
}


}
