import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express'; 
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // enable validation for DTOs
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, }));

  // allow file uploads
  app.enableCors({
  origin: ["http://localhost:3001","https://assignmentchecker-areeba.vercel.app"], // your frontend port
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
});

  app.useStaticAssets(join(__dirname, '..', 'output'), {
    prefix: '/output/',
  });

  await app.listen(3000);
  console.log(`🚀 Server running on http://localhost:3000`);
}
bootstrap();
