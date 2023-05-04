import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from "class-validator";

@ValidatorConstraint()
export class NameMatchesConstraint implements ValidatorConstraintInterface {
  private regex = /^[\u0E00-\u0E7Fa-zA-Z'\- ]{1,50}$/;

  validate(name: string, args: ValidationArguments): boolean {
    return this.regex.test(name);
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Name must be between 1-50 characters.';
  }
}

export function NameMatches(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: NameMatchesConstraint,
    });
  };
}
