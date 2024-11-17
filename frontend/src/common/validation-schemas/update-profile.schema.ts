import * as yup from 'yup';

export const UpdateProfileValidationSchema = yup.object().shape({
    username: yup.string().min(4).required(),
    oldPassword: yup.string(),
    newPassword: yup.string().notRequired().when('oldPassword', {
        is: (oldPassword: string) => oldPassword.length > 0,
        then: () => yup.string().min(6).required()
    }),
});