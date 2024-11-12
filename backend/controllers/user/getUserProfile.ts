import asyncHandler from 'express-async-handler';
import { RequestHandler, Request, Response } from 'express';

import { RequestWithUser } from '@/types/RequestWithUser';
import User from '@/models/userModel';

export const getUserProfile: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
        const userReq = req as RequestWithUser;

        if (!userReq.user?._id) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }

        try {
            const userProfile = await User.findById(userReq.user._id)
                .select('-password')
                .lean();

            if (!userProfile) {
                res.status(404).json({ message: 'User profile not found' });
                return;
            }

            res.status(200).json(userProfile);
        } catch (error) {
            console.error('Error in getUserProfile:', error);
            res.status(500).json({
                message:
                    error instanceof Error
                        ? error.message
                        : 'An unknown error occurred',
            });
        }
    },
);

export default getUserProfile;
