import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import {ValidationPipe} from "@nestjs/common";
require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: '*'
  });
  await app.listen(3000);
  console.log('Server Started');
}


bootstrap();
