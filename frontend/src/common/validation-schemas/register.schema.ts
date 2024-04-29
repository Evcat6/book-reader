import * as yup from 'yup';

export const RegisterValidationSchema = yup.object({
  username: yup.string().min(4).required(),
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
  repeatPassword: yup.string().oneOf([yup.ref('password')], 'Repeat password must match password field'),
});
