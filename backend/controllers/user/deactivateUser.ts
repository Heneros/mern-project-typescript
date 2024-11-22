import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';

import User from '@/models/userModel';

const deactivateUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error('User was not found');
    }
    if (user) {
        user.active = false;

        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
    } else {
        res.status(404);
        throw new Error('user was not found');
    }
});
export default deactivateUser;
