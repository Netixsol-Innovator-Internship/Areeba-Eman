import { NestFactory } from "@nestjs/core"
import { ValidationPipe } from "@nestjs/common"
import { AppModule } from "./app.module"
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express'; 

async function bootstrap() {
  // const app = await NestFactory.create(AppModule)
 const app = await NestFactory.create<NestExpressApplication>(AppModule); 
  // Enable CORS for frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || "http://192.168.18.96:3000",
    credentials: true,
  })

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  // Global prefix
  app.setGlobalPrefix("api")

   app.useStaticAssets(join(__dirname, '..', 'uploads'), {
  prefix: '/uploads/', })

  const port = process.env.PORT || 5000
  await app.listen(port)
  console.log(`Application is running on: http://localhost:${port}`)


 
};


bootstrap()
