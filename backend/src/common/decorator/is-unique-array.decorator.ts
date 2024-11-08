import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsArrayUnique(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isArrayUnique',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!Array.isArray(value)) {
            return false;
          }
          const uniqueValues = new Set(value);
          return uniqueValues.size === value.length;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must contain unique values`;
        },
      },
    });
  };
}
