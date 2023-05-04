import { Document, SchemaTypes, Types } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type BookingDocument = Booking & Document;

@Schema()
export class Booking {
  @Prop({
    type: SchemaTypes.ObjectId,
    required: true,
    auto: true,
  })
  _id: Types.ObjectId;

  @Prop({ required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  dentistId: Types.ObjectId;

  @Prop({
    default: function () {
      return Date.now();
    },
  })
  createDate: Date;

  @Prop({ required: true })
  bookingDate: Date;

  @Prop({
    default: false,
  })
  isDeleted: boolean;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
