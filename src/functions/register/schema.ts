export const registerSchema = {
  email: {
    type: "email",
    normalize: true,
    max: 255,
    messages: {
      email: "Email is not a valid email address",
      required: "Email is not a valid email address",
    },
  },
  password: {
    type: "string",
    min: 6,
    messages: {
      stringMin: "Password should not be up to 6 characters",
      required: "Password should not be up to 6 characters",
    },
  },
  confirmPassword: {
    type: "equal",
    field: "password",
    messages: {
      equalField: "Passwords do not match",
      required: "Passwords do not match",
    },
  },
  name: {
    type: "string",
    empty: false,
    max: 50,
    trim: true,
    messages: {
      required: "Name is required",
      stringEmpty: "Name is required",
      stringMax: "Name should not be more than 50 characters",
    },
  },
};
