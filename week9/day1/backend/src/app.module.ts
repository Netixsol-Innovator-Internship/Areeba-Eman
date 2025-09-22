import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResearchController } from './research/research.controller';
import { DocumentSchema } from './schemas/document.schema';
import * as dotenv from 'dotenv';
dotenv.config();

// console.log("MONGI ::::", process.env.MONGO_URI )
@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI ?? '', {
      dbName: 'research-ai',
    }),
    MongooseModule.forFeature([{ name: 'Document', schema: DocumentSchema }]),
  ],
  controllers: [ResearchController],
})
export class AppModule {}
