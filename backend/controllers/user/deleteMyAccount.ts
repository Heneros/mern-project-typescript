import asyncHandler from 'express-async-handler';
import User from '@/models/userModel';
import { RequestWithUser } from '@/types/RequestWithUser';

const deleteMyAccount = asyncHandler(async (req, res) => {
    const userReq = req as RequestWithUser;

    if (!userReq.user) {
        res.status(404).json({ message: 'Not found Request' });
        return;
    }

    const userId = userReq.user._id;
    await User.findByIdAndDelete(userId);

    res.json({
        success: true,
        message: 'Your user account has been deleted',
    });
});

export default deleteMyAccount;
