import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { CookieOptions, Request, Response } from 'express';
import User from '@/models/userModel';
import { systemLogs } from '@/utils/Logger';

// $-title   Login User, get access and refresh tokens
// $-path    POST /api/v1/auth/login
// $-auth    Public

const loginUser = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        // try {
        const { email, password } = req.body;

        // console.log(email, password);

        if (!email || !password) {
            // res.status(400);
            res.status(400).json({
                message: 'Please provide an email and password',
            });

            return;
        }

        const existingUser = await User.findOne({ email }).select('+password');

        if (!existingUser || !(await existingUser.matchPassword(password))) {
            res.status(400).json({ message: 'Invalid credentials provided' });
            // systemLogs.error('Incorrect email or password');
            return;
        }

        if (!existingUser.active) {
            res.status(400).json({
                message:
                    'Your account has been deactivated. Please contact support for assistance.,',
            });
            return;
        }

        const accessToken = jwt.sign(
            {
                id: existingUser._id,
                roles: existingUser.roles,
            },
            process.env.JWT_ACCESS_SECRET_KEY!,
            { expiresIn: '15m' },
        );

        const newRefreshToken = jwt.sign(
            {
                id: existingUser._id,
            },
            process.env.JWT_REFRESH_SECRET_KEY!,
            { expiresIn: '30d' },
        );

        const cookies = req.cookies;

        let newRefreshTokenArray = !cookies?.jwtVilla
            ? existingUser.refreshToken
            : existingUser.refreshToken.filter(
                  (refT) => refT !== cookies.jwtVilla,
              );

        if (cookies?.jwtVilla) {
            const refreshToken = cookies.jwtVilla;
            const existingRefreshToken = await User.findOne({
                refreshToken,
            }).exec();

            if (!existingRefreshToken) {
                newRefreshTokenArray = [];
            }

            const options: CookieOptions = {
                httpOnly: true,
                maxAge: 0,
                secure: process.env.NODE_ENV === 'production',
                sameSite:
                    process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            };

            res.clearCookie('jwtVilla', options);
        }

        existingUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
        await existingUser.save();

        res.cookie('jwtVilla', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.json({
            success: true,
            _id: existingUser._id,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
            username: existingUser.username,
            provider: existingUser.provider,
            avatar: existingUser.avatar,
            accessToken,
        });

        // } catch (error) {
        //     console.error('loginController', error);
        //     systemLogs.error(error);
        // }
    },
);

export default loginUser;
