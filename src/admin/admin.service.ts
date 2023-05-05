import * as bcrypt from 'bcrypt';
import { Model, Types } from 'mongoose';
import { BookingService } from 'src/booking/booking.service';
import { saltOrRounds } from 'src/constants/hash';
import { Role } from 'src/roles/enums/role.enum';
import { User, UserDocument } from 'src/users/schema/users.schema';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CreateDentistDto } from './dto/create-dentist.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly bookingService: BookingService,
  ) {}

  async createDentist(createDentistDto: CreateDentistDto) {
    const password = createDentistDto.password;
    createDentistDto.password = await bcrypt.hash(password, saltOrRounds);

    //make email insensitivecase
    createDentistDto.email = createDentistDto.email.toLowerCase();
    Object.assign(createDentistDto, {
      roles: [Role.Dentist],
    });
    let createdUser = new this.userModel(createDentistDto);
    return createdUser.save();
  }

  async getBooking(userId: Types.ObjectId) {
    const bookings = await this.bookingService.getBooking(userId);
    return bookings;
  }
}
