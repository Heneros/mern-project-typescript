import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import registerUser from '../controllers/auth/registerController.js';
import loginUser from '../controllers/auth/loginController.js';
import verifyUserEmail from '../controllers/auth/verifyEmailController.js';
import newAccessToken from '../controllers/auth/refreshTokenController.js';
import resendEmailVerificationToken from '../controllers/auth/resendVerifyEmailController.js';
import { resetPassword, resetPasswordRequest } from '../controllers/auth/passwordResetController.js';
// import User from '../models/userModel.js';
import logoutUser from '../controllers/auth/logoutController.js';

const router = express.Router();

router.post('/register', registerUser);
router.get('/verify/:emailToken/:userId', verifyUserEmail);
router.post('/login', loginUser);
router.get('/new_access_token', newAccessToken);
router.get('/resend_email_token', resendEmailVerificationToken);
router.post('/reset_password_request', resetPasswordRequest);
router.post('/reset_password', resetPassword);
router.get('/logout', logoutUser);

export default router;
