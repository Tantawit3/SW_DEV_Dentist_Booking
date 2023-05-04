import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type LoggerDocument = LoggerClass & Document;

@Schema({ collection: 'loggers' })
export class LoggerClass {
  @Prop({ required: true })
  method: string;

  @Prop({ required: true })
  endPoint: string;

  @Prop({ required: true })
  statusCode: string;

  @Prop({ required: true })
  contentLength: number;

  @Prop()
  email: string;

  @Prop({ required: true })
  userAgent: string;

  @Prop({ required: true })
  ip: string;

  @Prop()
  body: mongoose.Schema.Types.Mixed;

  @Prop({
    default: function () {
      return Date.now();
    },
  })
  date: Date;

  @Prop()
  statusStack?: string;
}

export const LoggerSchema = SchemaFactory.createForClass(LoggerClass);
