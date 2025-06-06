import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';

import User from '@/backend/models/userModel';
import { RequestWithUser } from '@/backend/types/RequestWithUser';

const deleteMyAccount = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        const userReq = req as RequestWithUser;

        if (!userReq.user) {
            res.status(404).json({
                success: false,
                message: 'Not found Request',
            });
            return;
        }
        const userId = userReq.user._id;
        await User.findByIdAndDelete(userId);

        res.json({
            success: true,
            message: 'Your user account has been deleted',
        });
    },
);

export default deleteMyAccount;
