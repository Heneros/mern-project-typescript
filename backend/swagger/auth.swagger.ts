import { feedbackSwagger } from './auth/feedback.swagger';
import { loginUserSwagger } from './auth/login.swagger';
import { registerUserSwagger } from './auth/register.swagger';
import { resendEmailTokenSwagger } from './auth/resend_email_token.swagger';
import { resetPasswordSwagger } from './auth/reset_password.swagger';
import { resetPasswordRequestSwagger } from './auth/reset_password_request.swagger';
import { verifyEmailSwagger } from './auth/verifyEmail.swagger';

export const authSwagger = {
    ...registerUserSwagger,
    ...loginUserSwagger,
    ...verifyEmailSwagger,
    ...resetPasswordSwagger,
    ...resetPasswordRequestSwagger,
    ...resendEmailTokenSwagger,
    ...feedbackSwagger,
};
