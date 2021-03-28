export const loginSchema = {
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
};
