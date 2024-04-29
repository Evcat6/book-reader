import * as yup from 'yup';

export const LoginValidationSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
});
