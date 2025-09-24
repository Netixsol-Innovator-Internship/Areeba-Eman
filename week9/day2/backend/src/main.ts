import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000',
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
