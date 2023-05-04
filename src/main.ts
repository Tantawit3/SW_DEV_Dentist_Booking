import { useContainer } from 'class-validator';
import { Container } from 'typedi';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { ErrorFilter } from './logger/all-exceptions.filter';
import { LoggerService } from './logger/logger.service';

useContainer(Container);
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const loggerService = app.get<LoggerService>(LoggerService);
  app.useGlobalFilters(new ErrorFilter(loggerService));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(8000);
}
bootstrap();
