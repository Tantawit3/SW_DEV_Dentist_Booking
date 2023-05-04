import * as Joi from 'joi';

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { LoggerMiddleware } from './logger.middleware';
import { LoggerClass, LoggerSchema } from './logger.schema';
import { LoggerService } from './logger.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        AUTH_SECRET: Joi.string().required(),
      }),
    }),
    JwtModule.register({
      secret: process.env.AUTH_SECRET,
    }),
    MongooseModule.forFeature([
      { name: LoggerClass.name, schema: LoggerSchema },
    ]),
  ],
  controllers: [],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
