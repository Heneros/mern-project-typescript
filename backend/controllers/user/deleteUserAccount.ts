import { Request, Response } from 'express';
import User from '@/models/userModel';

const deleteUserAccount = async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id);

    if (user) {
        await user.deleteOne();

        res.json({
            success: true,
            message: `User ${user.firstName} deleted successfully`,
        });
    } else {
        res.status(404);
        throw new Error('user not found');
    }
};

export default deleteUserAccount;
