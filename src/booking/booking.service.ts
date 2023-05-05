import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { bookingSessionHour } from 'src/constants/booking';
import { Role } from 'src/roles/enums/role.enum';
import { UsersService } from 'src/users/users.service';

import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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

    // Validate date
    this.validateDate(createBookingDto.bookingDate);

    // Check if dentist is avaiable in given date
    const isDentistAvailable = await this.checkDentistAvailable(
      dentist._id,
      createBookingDto.bookingDate,
    );
    if (isDentistAvailable !== true)
      throw new BadRequestException('dentist not avaiable on given time');

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
    const bookings = this.bookingModel.aggregate([
      { $match: filter },
      {
        $unset: ['__v', 'isDeleted'],
      },
      {
        $lookup: {
          from: 'users',
          localField: 'dentistId',
          foreignField: '_id',
          as: 'dentist',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $project: {
          bookingDate: 1,
          createDate: 1,
          dentistEmail: {
            $first: '$dentist.email',
          },
          userEmail: {
            $first: '$user.email',
          },
        },
      },
    ]);
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

    const updatedBooking = {};

    // Validate and assign dentist
    if (updateBookingDto.dentistEmail) {
      const dentist = await this.usersService.findOneEmail(
        updateBookingDto.dentistEmail,
      );
      if (!dentist || dentist.roles.includes(Role.Dentist) === false)
        throw new BadRequestException('invalid dentist');
      Object.assign(updatedBooking, {
        dentistId: dentist._id,
      });
    }

    // Validate date
    this.validateDate(
      updateBookingDto.bookingDate
        ? updateBookingDto.bookingDate
        : booking.bookingDate,
    );

    // Check if dentist is avaiable in given date
    const dentist = updateBookingDto.dentistEmail
      ? await this.usersService.findOneEmail(updateBookingDto.dentistEmail)
      : await this.usersService.findOneId(booking.dentistId);
    const isDentistAvailable = await this.checkDentistAvailable(
      dentist._id,
      updateBookingDto.bookingDate
        ? updateBookingDto.bookingDate
        : booking.bookingDate,
      booking._id,
    );
    if (isDentistAvailable !== true)
      throw new BadRequestException('dentist not avaiable on given time');

    // Assign bookingDate
    if (updateBookingDto.bookingDate) {
      Object.assign(updatedBooking, {
        bookingDate: updateBookingDto.bookingDate,
      });
    }

    await this.bookingModel.findByIdAndUpdate(
      { _id: bookingId },
      updatedBooking,
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

  async checkDentistAvailable(
    dentistId: mongoose.Types.ObjectId,
    date: Date,
    bookingId?: mongoose.Types.ObjectId,
  ) {
    date = new Date(date);
    const startSession = new Date(date).setHours(
      date.getHours() - bookingSessionHour,
    );
    const endSession = new Date(date).setHours(
      date.getHours() + bookingSessionHour,
    );
    const booking = await this.bookingModel.findOne({
      dentistId: dentistId,
      bookingDate: { $gte: startSession, $lte: endSession },
      _id: { $ne: bookingId },
      isDeleted: false,
    });
    return booking ? false : true;
  }

  validateDate(date: Date) {
    date = new Date(date);
    const now = new Date(Date.now());
    if (date < now) throw new BadRequestException('date invalid');
    return date;
  }
}
