import asyncHandler from 'express-async-handler';
import User from '@/models/userModel';

const getAllUserChats = asyncHandler(async (req, res) => {
    const users = await User.find({ publicToChat: true });
    res.status(200).json(users);
});

export default getAllUserChats;
