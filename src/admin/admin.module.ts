import { BookingModule } from 'src/booking/booking.module';
import { IsEmailAlreadyExistConstraint } from 'src/users/decorator/IsEmailAlreadyExist.decorator';
import { NameMatchesConstraint } from 'src/users/decorator/NameMatches.decorator';
import { PasswordMatchesConstraint } from 'src/users/decorator/PasswordMatches.decorator';
import { User, UserSchema } from 'src/users/schema/users.schema';
import { UsersModule } from 'src/users/users.module';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UsersModule,
    BookingModule,
  ],
  controllers: [AdminController],
  providers: [
    AdminService,
    IsEmailAlreadyExistConstraint,
    NameMatchesConstraint,
    PasswordMatchesConstraint,
  ],
  exports: [AdminService],
})
export class AdminModule {}
