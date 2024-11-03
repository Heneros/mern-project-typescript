import express from 'express';
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
import User from '../models/userModel';
import feedbackFormController from '../controllers/auth/feedbackFormController';
import { apiLimiter, loginLimiter } from '../middleware/apiLimiter';

const router = express.Router();

router.post('/register', apiLimiter, registerUser);
router.get('/verify/:emailToken/:userId', verifyUserEmail);
router.post('/login', loginLimiter, loginUser);
router.get('/new_access_token', newAccessToken);
router.post('/resend_email_token', resendEmailVerificationToken);
router.post('/reset_password_request', resetPasswordRequest);
router.post('/reset_password', resetPassword);
router.get('/logout', logoutUser);

router.post('/feedback', apiLimiter, feedbackFormController);

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
router.get(
    '/google/redirect',
    passport.authenticate('google', {
        failureRedirect: '/login',
        session: false,
    }),

    async (req, res) => {
        const existingUser = await User.findById(req.user.id);

        const payload = {
            id: req.user.id,
            roles: existingUser.roles,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName || 'Name',
            username: existingUser.username,
            provider: existingUser.provider,
            avatar: existingUser.avatar,
        };

        ///   console.log(payload);

        jwt.sign(
            payload,
            process.env.JWT_ACCESS_SECRET_KEY!,
            { expiresIn: '20m' },
            (err, token) => {
                const jwt = `${token}`;

                const embedJWT = `
    <html>
    <script>
    window.localStorage.setItem("googleToken",'${jwt}')
    window.location.href='/dashboard'
    </script>

    </html>
    
    `;
                res.send(embedJWT);
            },
        );
    },
);

export default router;
