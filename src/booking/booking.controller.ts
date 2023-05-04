import { Types } from 'mongoose';

import {
    BadRequestException, Body, Controller, Delete, Get, Patch, Post, Query, Req, Request
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@ApiTags('booking')
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  async createBooking(
    @Req() req,
    @Body() createBookingDto: CreateBookingDto,
  ): Promise<boolean> {
    const createdBooking = await this.bookingService.createBooking(
      req.user._id,
      createBookingDto,
    );
    return true;
  }

  @Get()
  async getBooking(@Request() req) {
    return await this.bookingService.getBooking(req.user._id);
  }

  @Patch()
  async editBooking(
    @Request() req,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    return await this.bookingService.editBooking(
      req.user._id,
      updateBookingDto,
    );
  }

  @Delete()
  async deleteBooking(@Request() req, @Query('bookingId') bookingId: string) {
    let bookingObjectId: Types.ObjectId;
    try {
      bookingObjectId = new Types.ObjectId(bookingId);
    } catch (err) {
      throw new BadRequestException('bookingId invalid');
    }
    return await this.bookingService.deleteBooking(
      req.user._id,
      bookingObjectId,
    );
  }
}
