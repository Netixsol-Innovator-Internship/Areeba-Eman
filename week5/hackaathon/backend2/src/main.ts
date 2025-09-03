import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import express from 'express';
dotenv.config();

async function bootstrap() {
  //trying
   const app = await NestFactory.create<NestExpressApplication>(AppModule);
   app.use("/uploads", express.static(join(__dirname, "uploads")));

   app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  
   app.enableCors({
    origin: 'http://localhost:3000', // frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  // await app.listen(4000);

  const config = new DocumentBuilder()
    .setTitle('Car Bidding API')
    .setDescription('API for the Car Bidding Platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, doc);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  //ttyingnnm
  console.log(`Server listening on http://localhost:${port}`);
}
bootstrap();
