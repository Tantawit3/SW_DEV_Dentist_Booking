import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from "class-validator";

@ValidatorConstraint()
export class PasswordMatchesConstraint implements ValidatorConstraintInterface {
  private regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,64}$/;

  validate(password: string, args: ValidationArguments): boolean {
    return this.regex.test(password);
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Password must be between 8-64 characters. At least 1 lowercase letter, 1 uppercase letter and 1 number.';
  }
}

export function PasswordMatches(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: PasswordMatchesConstraint,
    });
  };
}
