import * as yup from 'yup';

export const UploadBookValidationSchema = yup.object({
  isPrivate: yup.boolean().required(),
  name: yup.string().required(),
});
