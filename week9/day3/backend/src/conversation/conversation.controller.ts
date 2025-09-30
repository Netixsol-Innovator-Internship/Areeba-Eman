import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ConversationsService } from './conversation.service';
import { JwtAuthGuard } from '../guards/jwt.guard';

@Controller('conversations')
@UseGuards(JwtAuthGuard)
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  // Create a new chat explicitly
  // @Post('new')
  // createChat(@Req() req, @Body('chatId') chatId: string) {
  //   return this.conversationsService.createChat(req.user.userId.toString(), chatId);
  // }

  // Save a message and automatically create chat if it doesn't exist
  @Post()
  saveMessage(
    @Req() req,
    @Body('chatId') chatId: string,
    @Body('question') question: string,
    @Body('answer') answer: any,
  ) {
    return this.conversationsService.saveMessage(
      req.user.userId.toString(),
      chatId,
      question,
      answer,
    );
  }

  // Get all chats (metadata only)
  @Get()
  getChats(@Req() req) {
    return this.conversationsService.getChats(req.user.userId.toString());
  }

  // Get full chat history
  @Get(':chatId')
  getChatHistory(@Req() req, @Param('chatId') chatId: string) {
    return this.conversationsService.getChatHistory(req.user.userId.toString(), chatId);
  }

  // Delete a single chat
  @Delete(':chatId')
  deleteChat(@Req() req, @Param('chatId') chatId: string) {
    return this.conversationsService.deleteChat(req.user.userId.toString(), chatId);
  }

  // Delete all chats
  @Delete()
  clearChats(@Req() req) {
    return this.conversationsService.clearChats(req.user.userId.toString());
  }
}