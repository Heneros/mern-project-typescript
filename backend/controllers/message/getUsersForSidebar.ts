import asyncHandler from 'express-async-handler';
import User from '@/backend/models/userModel';
import { RequestWithUser } from '@/backend/types/RequestWithUser';

/// $-title Get specific chat
/// $-path GET /api/v1/messages/:id
/// $-auth Private

const getUsersForSidebar = asyncHandler(async (req, res) => {
    const userReq = req as RequestWithUser;

    if (!userReq.user) {
        res.status(400).json({ message: 'Not found Request' });
    }
    const loggedInUserId = userReq.user._id;
    const filteredUsers = await User.find({
        _id: { $ne: loggedInUserId },
        publicChat: true,
    }).select('-password -refreshToken -googleID');

    res.status(200).json(filteredUsers);
});

export default getUsersForSidebar;
