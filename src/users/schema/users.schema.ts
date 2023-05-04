import { Document, SchemaTypes, Types } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Role } from '../../roles/enums/role.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({
    type: SchemaTypes.ObjectId,
    required: true,
    auto: true,
  })
  _id: Types.ObjectId;

  /**
   * Password of the user
   * @example Password58
   */
  @Prop({ required: true })
  password: string;

  /**
   * First name of the user
   * @example Thanathai
   */
  @Prop({ required: true, default: 'defaultFirstName' })
  firstName: string;

  /**
   * Last name of the user
   * @example Lertpetchpun
   */
  @Prop({ required: true, default: 'defaultLastName' })
  lastName: string;

  /**
   * email of the user
   * @example save-000@hotmail.com
   */
  @Prop({ required: true })
  email: string;

  /**
   * Phone number of the user
   * @example 0877998572
   */
  @Prop({ required: true })
  phoneNumber: string;

  /**
   * Registration date of the user
   */
  @Prop({
    default: function () {
      return Date.now();
    },
  })
  registrationDate: Date;

  /**
   * Roles of the user
   * @example ['admin']
   */
  @Prop({
    default: [Role.User],
  })
  roles: Role[];

  @Prop()
  startDentisting?: Date;

  @Prop()
  expertise?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
