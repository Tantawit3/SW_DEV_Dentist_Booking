import { IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { IsEmailAlreadyExist } from '../decorator/IsEmailAlreadyExist.decorator';
import { NameMatches } from '../decorator/NameMatches.decorator';
import { PasswordMatches } from '../decorator/PasswordMatches.decorator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmailAlreadyExist()
  @IsEmail()
  email: string;

  @PasswordMatches()
  @ApiProperty({ description: 'Password55' })
  password: string;

  @NameMatches()
  firstName: string;

  @NameMatches()
  lastName: string;

  @IsPhoneNumber('TH')
  @IsNotEmpty()
  phoneNumber: string;
}
