import asyncHandler from 'express-async-handler';
import { Request } from 'express';

import User from '@/models/userModel';
import { RequestWithUser } from '@/types/RequestWithUser';

const updateUserProfile = asyncHandler(async (req, res) => {
    /// const userId = req.user._id;
    const userId = req as RequestWithUser;
    if (!userId.user) {
        res.status(404).json({ message: 'Not found Request' });
        return;
    }

    const {
        password,
        passwordConfirm,
        email,
        isEmailVerified,
        provider,
        roles,
        googleID,
        username,
    } = req.body;

    const user = await User.findById(userId);

    if (!user) {
        res.status(400);
        throw new Error('That user does not exist in our system');
    }

    if (password || passwordConfirm) {
        res.status(400);
        throw new Error(
            'This route is not for password updates. Please use the password reset functionality instead',
        );
    }

    if (email || isEmailVerified || provider || roles) {
        res.status(400);
        throw new Error(
            'You are not allowed to update that field on this route',
        );
    }
    const fieldsToUpdate = req.body;

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
