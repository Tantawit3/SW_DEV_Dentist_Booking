import { IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateBookingDto {
  @IsNotEmpty()
  @IsString()
  bookingId: string;

  @IsDateString()
  @IsOptional()
  bookingDate?: Date;

  @IsEmail()
  @IsOptional()
  dentistEmail?: string;
}
