import { IsDateString, IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
import { IsEmailAlreadyExist } from 'src/users/decorator/IsEmailAlreadyExist.decorator';
import { NameMatches } from 'src/users/decorator/NameMatches.decorator';
import { PasswordMatches } from 'src/users/decorator/PasswordMatches.decorator';

export class CreateDentistDto {
  @IsNotEmpty()
  @IsDateString()
  startDentisting: Date;

  @IsNotEmpty()
  @IsString()
  expertise: string;

  @IsNotEmpty()
  @IsEmail()
  @IsEmailAlreadyExist()
  email: string;

  @IsNotEmpty()
  @PasswordMatches()
  password: string;

  @IsNotEmpty()
  @NameMatches()
  firstName: string;

  @IsNotEmpty()
  @NameMatches()
  lastName: string;

  @IsNotEmpty()
  @IsPhoneNumber('TH')
  phoneNumber: string;
}
