import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import User from '@/models/userModel';

const deleteUserAccount = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        const user = await User.findById(req.params.id);
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found',
            });
            return;
        }

        await user.deleteOne();
        res.json({
            success: true,
            message: `User ${user.firstName} deleted successfully`,
        });
    },
);

export default deleteUserAccount;
