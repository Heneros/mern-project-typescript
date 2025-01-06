import { registerUserSwagger } from './auth/register.swagger';
import { resetPasswordSwagger } from './auth/reset_password.swagger';
import { verifyEmailSwagger } from './auth/verifyEmail.swagger';

export const authSwagger = {
    ...registerUserSwagger,
    ...resetPasswordSwagger,
    ...verifyEmailSwagger,
};
