import asyncHandler from 'express-async-handler';

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

    const { currentPassword, password, passwordConfirm, ...fieldsToUpdate } =
        req.body;

    const user = await User.findById(userId).select('+password');

    if (!user) {
        res.status(400).json({
            message: 'User does not exist in our system',
        });
        return;
    }

    if (!currentPassword) {
        res.status(400).json({ message: ' Current Password is required' });
        return;
    }
    const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password,
    );

    if (!isPasswordValid) {
        res.status(401).json({ message: 'Current password is incorrect' });
        return;
    }

    if (password) {
        if (password !== passwordConfirm) {
            res.status(400).json({ message: 'New passwords do not match' });
            return;
        }
        fieldsToUpdate.password = await bcrypt.hash(password, 10);
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
