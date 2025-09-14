import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { json, urlencoded } from 'express';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as bodyParser from 'body-parser';

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors({ origin: true, credentials: true });
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true }));
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads/' });
  const config = new DocumentBuilder().setTitle('E-commerce API').setDescription('OTP auth, roles, products').setVersion('1.0').addBearerAuth().build();
  const doc = SwaggerModule.createDocument(app, config);
  app.use('/orders/webhook',
  bodyParser.raw({ type: 'application/json' }),);

  SwaggerModule.setup('api', app, doc);
  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`API running on http://localhost:${port} (Swagger: /api)`);
}
bootstrap();
