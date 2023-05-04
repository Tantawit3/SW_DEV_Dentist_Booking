import { IsDateString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateBookingDto {
  @IsDateString()
  @IsNotEmpty()
  bookingDate: Date;

  @IsEmail()
  @IsNotEmpty()
  dentistEmail: string;
}
