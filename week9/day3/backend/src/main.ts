import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors({
    origin: 'https://cricketai-areeba.vercel.app',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
  });
  mongoose.connect(process.env.MONGO_URI ?? '', { dbName: 'research-ai' })
    .then(() => console.log('✅ MongoDB connected!'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));
  await app.listen(4000);
  console.log('🚀 Backend running on http://localhost:4000');
}

bootstrap();
