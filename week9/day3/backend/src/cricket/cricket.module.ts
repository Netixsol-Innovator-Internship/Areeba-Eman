import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CricketController } from './cricket.controller';
import { CricketService } from './cricket.service';
import { Match, MatchSchema } from './schemas/match.schema';
import { ConversationsModule } from 'src/conversation/conversation.module';
import { SummariesModule } from 'src/summary/summary.module';
import { ConversationsService } from 'src/conversation/conversation.service';
import { UsersModule } from 'src/users/users.module';
import { User, UserSchema } from 'src/users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Match.name, schema: MatchSchema },
      { name: User.name, schema: UserSchema },
    ]),
    ConversationsModule,
    SummariesModule,
    UsersModule,
  ],
  controllers: [CricketController],
  providers: [CricketService, ConversationsService],
  exports:[CricketService],
})
export class CricketModule {}
