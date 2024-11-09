import 'dotenv/config';
import express, { Request, Response } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import registerUser from '../controllers/auth/registerController';
import loginUser from '../controllers/auth/loginController';
import verifyUserEmail from '../controllers/auth/verifyEmailController';
import newAccessToken from '../controllers/auth/refreshTokenController';
import resendEmailVerificationToken from '../controllers/auth/resendVerifyEmailController';
import {
    resetPassword,
    resetPasswordRequest,
} from '../controllers/auth/passwordResetController';
import logoutUser from '../controllers/auth/logoutController';

import feedbackFormController from '../controllers/auth/feedbackFormController';
import { apiLimiter, loginLimiter } from '../middleware/apiLimiter';

import handleOAuthCallback from '@/helpers/handleOAuthCallback';

const router = express.Router();
const domain = process.env.DOMAIN_CLIENT;

router.post('/register', apiLimiter, registerUser);
router.get('/verify/:emailToken/:userId', verifyUserEmail);
router.post('/login', loginLimiter, loginUser);
router.route('/new_access_token').get(newAccessToken);
router.post('/resend_email_token', resendEmailVerificationToken);
router.post('/reset_password_request', resetPasswordRequest);
router.post('/reset_password', resetPassword);
router.get('/logout', logoutUser);

router.route('/feedback').post(apiLimiter, feedbackFormController);

router.get(
    '/github',
    passport.authenticate('github', {
        scope: ['user:email'],
    }),
);

router.route('/github/callback').get(
    passport.authenticate('github', {
        failureRedirect: `${domain}/login?error=auth_failed`,
    }),

    handleOAuthCallback('githubToken'),
);

router.route('/google').get(
    passport.authenticate('google', {
        session: false,
        scope: ['profile', 'email', 'openid'],
        accessType: 'offline',
        prompt: 'consent',
    } as any),
);

// $-title   Redirect route to the passport google strategy
// $-path    GET /api/v1/auth/google/redirect
router.route('/google/redirect').get(
    passport.authenticate('google', {
        failureRedirect: '/login',
        session: false,
    }),
    handleOAuthCallback('googleToken'),
);

export default router;
