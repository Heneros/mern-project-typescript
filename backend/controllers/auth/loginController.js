import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../../models/userModel.js';
import { systemLogs } from '../../utils/Logger.js';

// $-title   Login User, get access and refresh tokens
// $-path    POST /api/v1/auth/login
// $-auth    Public

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error('Please provide an email and password');
    }

    const existingUser = await User.findOne({ email }).select('+password');

    if (!existingUser || !(await existingUser.comparePassword(password))) {
        res.status(400);
        systemLogs.error('Incorrect email or password');
        throw new Error('Invalid credentials provided');
    }

    if (!existingUser.active) {
        res.status(400);
        throw new Error('Your account has been deactivated. Please contact support for assistance.');
    }

    const accessToken = jwt.sign(
        {
            id: existingUser._id,
            roles: existingUser.roles,
        },
        process.env.JWT_ACCESS_SECRET_KEY,
        { expiresIn: '30d' },
    );

    const newRefreshToken = jwt.sign(
        {
            id: existingUser._id,
        },
        process.env.JWT_REFRESH_SECRET_KEY,
        { expiresIn: '1d' },
    );

    const cookies = req.cookies;

    let newRefreshTokenArray = !cookies?.jwtVilla
        ? existingUser.refreshToken
        : existingUser.refreshToken.filter((refT) => refT !== cookies.jwtVilla);

    if (cookies?.jwtVilla) {
        const refreshToken = cookies.jwtVilla;
        const existingRefreshToken = await User.findOne({ refreshToken }).exec();

        if (!existingRefreshToken) {
            newRefreshTokenArray = [];
        }

        const options = {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            secure: true,
            sameSite: 'None',
        };

        res.clearCookie('jwtVilla', options);
    }

    existingUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    await existingUser.save();

    res.cookie('jwtVilla', newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
        success: true,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        username: existingUser.username,
        provider: existingUser.provider,
        avatar: existingUser.avatar,
        accessToken,
    });
});

export default loginUser;
