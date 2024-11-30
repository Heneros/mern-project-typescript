import asyncHandler from 'express-async-handler';
import User from '@/models/userModel';
import Message from '@/models/chatModel';

import { RequestWithUser } from '@/types/RequestWithUser';

const getUsersForSidebar = asyncHandler(async (req, res) => {
    const userReq = req as RequestWithUser;

    if (!userReq.user) {
        res.status(400).json({ message: 'Not found Request' });
    }
    const loggedInUserId = userReq.user._id;
    const filteredUsers = await User.find({
        _id: { $ne: loggedInUserId },
    }).select('-password');

    res.status(200).json(filteredUsers);
});

export default getUsersForSidebar;