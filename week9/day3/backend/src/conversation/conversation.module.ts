import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Conversation, ConversationSchema } from './schema/conversation.schema';
import { ConversationsService } from './conversation.service';
import { ConversationsController } from './conversation.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Conversation.name, schema: ConversationSchema }])],
  providers: [ConversationsService],
  controllers: [ConversationsController],
  exports: [ConversationsService, MongooseModule],
})
export class ConversationsModule {}
