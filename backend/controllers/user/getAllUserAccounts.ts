import asyncHandler from 'express-async-handler';
import User from '../../models/userModel';
import { RequestWithUser } from '@/types/RequestWithUser';

const getAllUserAccounts = asyncHandler(async (req, res) => {
    const pageSize = Number(process.env.PAGE_SIZE) || 10;

    const page = Number(req.query.pageNumber) || 1;
    const userReq = req as RequestWithUser;

    if (!userReq.user?._id) {
        res.status(401).json({ message: 'Not authorized' });
        return;
    }
    const loggedInUserId = userReq.user._id;
    const count = await User.countDocuments({});

    const users = await User.find({ _id: { $ne: loggedInUserId } })
        .sort({ createdAt: -1 })
        .select('-refreshToken')
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .lean();

    res.status(200).json({
        success: true,
        count,
        numberOfPages: Math.ceil(count / pageSize),
        users,
    });
});

export default getAllUserAccounts;
