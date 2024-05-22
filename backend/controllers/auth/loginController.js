import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../../models/UserModel';
import { systemLogs } from '../../utils/Logger';

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
        throw new Error(
            'You are not verified. Check your email, a verification email link was sent when you registered',
        );
    }

    if (!existingUser.active) {
        res.status(400);
        throw new Error(
            'You have been deactivated by the admin and login is impossible. Contact us for enquiries',
        );
    }

    // if (existingUser && (await existingUser.comparePassword(password))) {
    // }
});
