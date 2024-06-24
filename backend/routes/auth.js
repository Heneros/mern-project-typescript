import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import registerUser from '../controllers/auth/registerController.js';
import loginUser from '../controllers/auth/loginController.js';
import verifyUserEmail from '../controllers/auth/verifyEmailController.js';
import newAccessToken from '../controllers/auth/refreshTokenController.js';
import resendEmailVerificationToken from '../controllers/auth/resendVerifyEmailController.js';
import {
    resetPassword,
    resetPasswordRequest,
} from '../controllers/auth/passwordResetController.js';
// import User from '../models/userModel.js';
import logoutUser from '../controllers/auth/logoutController.js';
import User from '../models/userModel.js';

const router = express.Router();

router.post('/register', registerUser);
router.get('/verify/:emailToken/:userId', verifyUserEmail);
router.post('/login', loginUser);
router.get('/new_access_token', newAccessToken);
router.post('/resend_email_token', resendEmailVerificationToken);
router.post('/reset_password_request', resetPasswordRequest);
router.post('/reset_password', resetPassword);
router.get('/logout', logoutUser);

router.get(
    '/google',
    passport.authenticate('google', {
        session: false,
        scope: ['profile', 'email'],
        accessType: 'offline',
        prompt: 'consent',
    }),
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

        console.log(payload);

        jwt.sign(
            payload,
            process.env.JWT_ACCESS_SECRET_KEY,
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
