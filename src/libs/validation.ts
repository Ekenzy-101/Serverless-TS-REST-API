import FastestValidator, { ValidationSchema } from "fastest-validator";

export const getValidationErrors = (
  value: any,
  schema: ValidationSchema<any>
) => {
  const validator = new FastestValidator();
  const errors = validator.validate(value, schema);
  if (errors === true) return null;

  const formattedErrors: Record<string, string> = {};
  errors.forEach((error) => {
    const key = error.field;
    formattedErrors[key] = error.message!;
  });

  return formattedErrors;
};
