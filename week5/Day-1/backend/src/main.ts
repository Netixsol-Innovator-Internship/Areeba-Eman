import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  app.enableCors({
    origin: 'http://localhost:3000', // frontend URL
    credentials: true,
  });

  // Attach Socket.IO adapter
  app.useWebSocketAdapter(new IoAdapter(app));

  await app.listen(4000);
}
bootstrap();
