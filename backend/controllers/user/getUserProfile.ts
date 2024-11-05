import asyncHandler from 'express-async-handler';
import { RequestWithUser } from '@/types/RequestWithUser';
import User from '@/models/userModel';

const getUserProfile = asyncHandler(async (req, res) => {
    // const userId = req.user._id;
    const userId = req as RequestWithUser;
    if (!userId.user) {
        res.status(404).json({ message: 'Not found Request' });
        return;
    }
    const userProfile = await User.findById(userId, {
        refreshToken: 0,
        roles: 0,
        _id: 0,
    }).lean();

    if (!userProfile) {
        res.status(204);
        throw new Error('user profile not found');
    }

    res.status(200).json({
        success: true,
        userProfile,
    });
});

export default getUserProfile;
