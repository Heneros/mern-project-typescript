import asyncHandler from 'express-async-handler';
import { Request } from 'express';
import bcrypt from 'bcryptjs';

import User from '@/models/userModel';
import { RequestWithUser } from '@/types/RequestWithUser';

const updateUserProfile = asyncHandler(async (req, res) => {
    const userReq = req as RequestWithUser;
    if (!userReq.user) {
        res.status(404).json({ message: 'Not found Request' });
        return;
    }

    const userId = userReq.user._id;

    const {
        password,
        passwordConfirm,
        ...fieldsToUpdate
        //     username,
    } = req.body;

    const user = await User.findById(userId).select('+password');

    if (!user) {
        res.status(400).json({
            message: 'User does not exist in our system',
        });
        return;
    }

    if (password && password !== passwordConfirm) {
        res.status(400).json({ message: 'New passwords do not match' });
        return;
    }

    if (password) {
        fieldsToUpdate.password = await bcrypt.hash(password, 10);
    }

    if (!user) {
        res.status(400);
        throw new Error('That user does not exist in our system');
    }

    if (password !== passwordConfirm) {
        res.status(400);
        throw new Error(
            'This route is not for password updates. Please use the password reset functionality instead',
        );
    }

    const updatedProfile = await User.findByIdAndUpdate(
        userId,
        { ...fieldsToUpdate },
        { new: true, runValidators: true },
    ).select('-refreshToken');

    res.status(200).json({
        success: true,
        message: `${user.firstName} , your profile was successfully updated`,
        updatedProfile,
    });
});

export default updateUserProfile;
