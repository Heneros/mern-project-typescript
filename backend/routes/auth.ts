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
import checkAuth from '@/middleware/checkAuthMiddleware';

const router = express.Router();
const domain = process.env.DOMAIN_CLIENT;

router.post('/register', apiLimiter, registerUser);

router.get('/verify/:emailToken/:userId', verifyUserEmail);
/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login a user
 *     description: Log in a user and return access and refresh tokens.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address.
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: User's password.
 *                 example: password123
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: Access token.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 refreshToken:
 *                   type: string
 *                   description: Refresh token.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Unauthorized - Invalid credentials
 */

router.post('/login', loginLimiter, loginUser);

router.route('/new_access_token').get(newAccessToken);

/**
 * @swagger
 * /auth/resend_email_token:
 *  post:
 *   tags:
 *     - Authentication
 *   summary: Resend email verification token.
 *   description: Resends an email verification token to the user if the email is not yet verified.
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *          schema:
 *              type: object
 *              required:
 *               - email
 *              properties:
 *                email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *                 description: The email address of the user.
 *   responses:
 *      200:
 *        description: Successfully sent a new email verification link.
 *        content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                   success:
 *                      type: boolean
 *                      example: true
 *                   message:
 *                      type: string
 *                      example: "USERNAME,  an email has been sent to your account, please verify within 15 minutes"
 *      400:
 *        description:  Bad Request. Invalid email, user not found, or user already verified.
 *      500:
 *        description: Internal server error.
 */
router.post('/resend_email_token', resendEmailVerificationToken);

/**
 * @swagger
 * /auth/reset_password_request:
 *  post:
 *   tags:
 *     - Authentication
 *   summary: Reset Password Request.
 *   description: Reset Password request should send an email to user to reset password.
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *          schema:
 *              type: object
 *              required:
 *               - email
 *              properties:
 *                email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *                 description: The email address of the user.
 *   responses:
 *      200:
 *        description: Successfully sent request to email account.
 *        content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                   success:
 *                      type: boolean
 *                      example: true
 *                   newVerificationToken:
 *                      type: string
 *                      example: newVerificationToken
 *                   message:
 *                      type: string
 *                      example: "USERNAME, an email has been sent to your account with the password reset link"
 *      400:
 *        description:  That email is not associated with any account
 *      500:
 *        description: Internal server error.
 *
 *
 */
router.post('/reset_password_request', resetPasswordRequest);

router.post('/reset_password', resetPassword);

router.get('/logout', logoutUser);

/**
 * @swagger
 * /auth/feedback/:
 *  post:
 *    tags:
 *      - Authentication
 *    summary: Send feedback form
 *    description: Send feedback  data form to admin
 *    requestBody:
 *      required: true
 *      content:
 *         application/json:
 *           schema:
 *              type: object
 *              required:
 *               - name
 *               - email
 *               - subject
 *               - message
 *              properties:
 *                email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *                 description: The email address of the user.
 *                subject:
 *                 type: string
 *                 example: TestSubject
 *                 description: Subject to send in header in mail
 *                message:
 *                 type: string
 *                 example: Message
 *                 description: Message to send in mail body
 *                name:
 *                 type: string
 *                 example: Name
 *                 description: Name of user
 *    responses:
 *      201:
 *        description: Data was sent!
 *        content:
 *           application/json:
 *              schema:
 *                type: object
 *                properties:
 *                   message:
 *                     type: string
 *                     example: "message was sent!"
 *      400:
 *        description: Bad request. Field(s) missing value(s)
 *      500:
 *        description: Internal server error.
 */
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
