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
import User from '../models/userModel';
import feedbackFormController from '../controllers/auth/feedbackFormController';
import { apiLimiter, loginLimiter } from '../middleware/apiLimiter';
import { RequestWithUser } from '../types/RequestWithUser';

const router = express.Router();

router.post('/register', apiLimiter, registerUser);
router.get('/verify/:emailToken/:userId', verifyUserEmail);
router.post('/login', loginLimiter, loginUser);
router.get('/new_access_token', newAccessToken);
router.post('/resend_email_token', resendEmailVerificationToken);
router.post('/reset_password_request', resetPasswordRequest);
router.post('/reset_password', resetPassword);
router.get('/logout', logoutUser);

router.route('/feedback').post(apiLimiter, feedbackFormController);

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
    async (req: Request, res: Response): Promise<void> => {
        try {
            const userReq = req as RequestWithUser;

            if (!userReq.user) {
                res.status(404).json({ message: 'Not found Request' });
                return;
            }
            const existingUser = await User.findById(userReq.user.id);

            if (!existingUser) {
                res.status(404).json({ message: 'Not found User' });
                return;
            }

            const payload = {
                id: userReq.user.id,
                roles: userReq.user.roles,
                firstName: userReq.user.firstName,
                lastName: userReq.user.lastName || 'No Name',
                username: userReq.user.username,
                provider: userReq.user.provider,
                avatar: userReq.user.avatar,
            };
            jwt.sign(
                payload,
                process.env.JWT_ACCESS_SECRET_KEY!,
                { expiresIn: '7d' },
                (err, token) => {
                    if (err) {
                        console.log(err);
                        return res
                            .status(500)
                            .send(`Error generating token '  ${err}`);
                    }
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
        } catch (error) {
            console.log(error);
        }
    },
);

export default router;
