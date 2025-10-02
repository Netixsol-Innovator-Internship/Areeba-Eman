import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { v4 as uuidv4 } from 'uuid';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async sendMessage(
    @Body('message') message: string,
    @Body('chatId') chatId?: string,
  ) {
    // generate a new chatId if missing
    if (!chatId) {
      chatId = uuidv4();
    }

    const result = await this.chatService.sendMessage(chatId, message);
    return { chatId, ...result };
  }
   


  @Post('reset')
  async reset(@Body('chatId') chatId: string) {
    this.chatService.resetChat(chatId);
    return { message: 'Chat reset successfully' };
  }
}
