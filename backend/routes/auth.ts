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

import checkAuthController from '../controllers/auth/checkAuthController';

const router = express.Router();
const domain = process.env.DOMAIN_CLIENT;

/**
 * @swagger
 *
 * /auth/register:
 *   post:
 *     tags:
 *        - Authentication
 *     summary: Registration user
 *     description: Registration with confirmation in mail box
 *     requestBody:
 *      required: true
 *      content:
 *          application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   email:
 *                     type: string
 *                     description: Users email should be unique
 *                     example: test4@gmail.com
 *                   username:
 *                     type: string
 *                     description:  username must be alphanumeric,without special characters.Hyphens and underscores allowed. Also he should have unique.
 *                     example: james1ja
 *                   firstName:
 *                     type: string
 *                     description: First Name
 *                     example:  First Name
 *                   lastName:
 *                     type: string
 *                     description: Last Name
 *                     example:  Last Name
 *                   password:
 *                     type: string
 *                     description: Users password
 *                     example:  password
 *                   passwordConfirm:
 *                     type: string
 *                     description: Confirm password
 *                     example:  confirm password
 *     responses:
 *         400:
 *          description: Invalid request.
 *         201:
 *          description:
 *               content:
 *                 application/json:
 *                    schema:
 *                      type: object
 *                      properties:
 *                         success:
 *                           type: boolean
 *                           example: true
 *                         message:
 *                           type: string
 *                           example: "Verification email sent. Please verify within 15 minutes."
 *                         userId:
 *                           type: string
 *                           example: "64f9c7f3e8b2b724708b3456"
 * */
router.post('/register', apiLimiter, registerUser);

/**
 * @swagger
 * /auth/verify/{emailToken}/{userId}:
 *    get:
 *      tags:
 *       - Authentication
 *      summary: Verify user email
 *      description: Verifies a user's email address using the token sent to their email.
 *      parameters:
 *          - in: path
 *            name: emailToken
 *            required: true
 *            schema:
 *              type: string
 *            description: Email verification token.
 *          - in: path
 *            name: userId
 *            required: true
 *            schema:
 *              type: string
 *            description: User ID to verify
 *      responses:
 *        200:
 *          description: Email successfully verified. User can now log in.
 *          content:
 *            application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      message:
 *                          type: string
 *                          example: "Email successfully verified. Please log in."
 *        400:
 *         description: Invalid token or user already verified.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Token invalid or expired."
 *
 *
 *
 */

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

/**
 * @swagger
 * /auth/new_access_token:
 *  get:
 *    tags:
 *      - Authentication
 *    summary: New Access Token
 *    description: Send access token to user after registration.
 *    parameters:
 *      - in: cookie
 *        name: jwtVilla
 *        required: true
 *        schema:
 *          type: string
 *          description: Refresh token stored in the browser cookies.
 *        response:
 *          200:
 *           description: Successfully issued a new access token.
 *           content:
 *              application/json:
 *               schema:
 *                  type: object
 *                  properties:
 *                    success:
 *                      type: boolean
 *                      example: true
 *
 *
 *
 */
router.route('/new_access_token').get(newAccessToken);
router.post('/resend_email_token', resendEmailVerificationToken);
router.post('/reset_password_request', resetPasswordRequest);
router.post('/reset_password', resetPassword);
router.get('/logout', logoutUser);
router.get('/check', checkAuth, checkAuthController);

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
