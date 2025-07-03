import asyncHandler from 'express-async-handler';
import User from '@/models/userModel';

const logoutUser = asyncHandler(async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwtVilla) {
        res.sendStatus(204);
        throw new Error('No cookie found');
    }

    const refreshToken = cookies.jwtVilla;

    const existingUser = await User.findOne({ refreshToken });

    if (!existingUser) {
        res.clearCookie('jwtVilla', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        });
        res.sendStatus(204);
    }
    if (existingUser) {
        existingUser.refreshToken = existingUser.refreshToken.filter(
            (refT: any) => refT !== refreshToken,
        );

        await existingUser.save();

        res.clearCookie('jwtVilla', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        });

        res.status(200).json({
            success: true,
            message: `${existingUser.firstName},you have been logged out successfully`,
        });
    }
});

export default logoutUser;
