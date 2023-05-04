import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { IsEmailAlreadyExistConstraint } from './decorator/IsEmailAlreadyExist.decorator';
import { NameMatchesConstraint } from './decorator/NameMatches.decorator';
import { PasswordMatchesConstraint } from './decorator/PasswordMatches.decorator';
import { User, UserSchema } from './schema/users.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    // ConfigModule.forRoot({
    //   validationSchema: Joi.object({
    //     SOME_SECRET: Joi.string().required(),
    //   }),
    // }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    IsEmailAlreadyExistConstraint,
    NameMatchesConstraint,
    PasswordMatchesConstraint,
  ],
  exports: [UsersService],
})
export class UsersModule {}
