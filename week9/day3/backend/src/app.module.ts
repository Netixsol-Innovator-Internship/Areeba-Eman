import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConversationsModule } from './conversation/conversation.module';
import { SummariesModule } from './summary/summary.module';
import { ConfigModule, ConfigService } from '@nestjs/config'
import { CricketModule } from './cricket/cricket.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
      }),
    }),
    UsersModule,
    AuthModule,
    CricketModule,
    ConversationsModule,
    SummariesModule,
  ],
})
export class AppModule {}

