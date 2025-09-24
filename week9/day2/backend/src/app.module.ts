import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CricketModule } from './cricket/cricket.module';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI ?? '', {
      dbName: 'cricket_ai',
    }),
    CricketModule,
    
  ],
  controllers: [],
})
export class AppModule {}
