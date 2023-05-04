import {
    registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint,
    ValidatorConstraintInterface
} from 'class-validator';

import { BadRequestException } from '@nestjs/common';

import { UsersService } from '../users.service';

// @Injectable()
@ValidatorConstraint({ async: true })
export class IsEmailAlreadyExistConstraint
  implements ValidatorConstraintInterface
{
  constructor(protected readonly usersService: UsersService) {}
  async validate(email: string, args: ValidationArguments): Promise<boolean> {
    if (!email) throw new BadRequestException('email should not be empty');
    const user = await this.usersService.findOneEmail(email.toLowerCase());
    if (user) return false;
    return true;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Email duplicated';
  }
}

export function IsEmailAlreadyExist(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailAlreadyExistConstraint,
    });
  };
}
