import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { Role } from 'src/roles/enums/role.enum';
import { UsersService } from 'src/users/users.service';

import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';

import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking, BookingDocument } from './schema/booking.schema';

@Injectable()
export class BookingService {
  constructor(
    @InjectConnection() private readonly connection: mongoose.Connection,
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    private readonly usersService: UsersService,
  ) {}
  async createBooking(
    userId: mongoose.Types.ObjectId,
    createBookingDto: CreateBookingDto,
  ) {
    const user = await this.usersService.findOneId(userId);

    // Validate given user
    if (!user) throw new UnauthorizedException('user unknown');

    // Check if user currently hold any booking, throw error if user have one
    const booking = await this.bookingModel.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      bookingDate: { $gte: new Date(Date.now()) },
      isDeleted: false,
    });
    if (booking)
      throw new BadRequestException('user currently hold another booking');

    // Validate dentist
    const dentist = await this.usersService.findOneEmail(
      createBookingDto.dentistEmail,
    );
    if (!dentist || dentist.roles.includes(Role.Dentist) === false)
      throw new BadRequestException('invalid dentist');

    // Attach userId and dentistId into booking
    Object.assign(createBookingDto, {
      userId: user._id,
      dentistId: dentist._id,
    });

    let createdBooking = new this.bookingModel(createBookingDto);
    return createdBooking.save();
  }

  async getBooking(userId: mongoose.Types.ObjectId) {
    const user = await this.usersService.findOneId(userId);
    const filter = { isDeleted: false };
    if (user.roles.includes(Role.Admin) === false) {
      Object.assign(
        filter,
        user.roles.includes(Role.User)
          ? { userId: userId }
          : { dentistId: userId },
      );
    }
    const bookings = this.bookingModel.find(filter);
    return bookings;
  }

  async editBooking(
    userId: mongoose.Types.ObjectId,
    updateBookingDto: UpdateBookingDto,
  ) {
    // Validate booking id
    let bookingId;
    try {
      bookingId = new mongoose.Types.ObjectId(updateBookingDto.bookingId);
    } catch (err) {
      throw new BadRequestException('bookingId invalid');
    }

    // Validate user and booking
    const user = await this.usersService.findOneId(userId);
    if (!user) throw new UnauthorizedException('user unknown');
    const booking = await this.bookingModel.findById(bookingId);
    if (!booking) throw new BadRequestException('booking unknown');

    // Check if user is owner of the booking, skip if user is admin
    if (
      user.roles.includes(Role.Admin) === false &&
      booking.userId.equals(userId) === false
    )
      throw new UnauthorizedException('booking is not belong to user');

    delete updateBookingDto.bookingId;
    await this.bookingModel.findByIdAndUpdate(
      { _id: bookingId },
      updateBookingDto,
    );

    return true;
  }

  async deleteBooking(
    userId: mongoose.Types.ObjectId,
    bookingId: mongoose.Types.ObjectId,
  ) {
    // Validate user and booking
    const user = await this.usersService.findOneId(userId);
    if (!user) throw new UnauthorizedException('user unknown');
    const booking = await this.bookingModel.findById(bookingId);
    if (!booking) throw new BadRequestException('booking unknown');

    // Check if user is owner of the booking, skip if user is admin
    if (
      user.roles.includes(Role.Admin) === false &&
      booking.userId.equals(userId) === false
    )
      throw new UnauthorizedException('booking is not belong to user');

    // Delete booking by mask as deleted
    await this.bookingModel.findByIdAndUpdate(
      { _id: bookingId },
      { isDeleted: true },
    );

    return true;
  }
}
