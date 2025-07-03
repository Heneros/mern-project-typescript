import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import { CookieOptions, Request, Response } from 'express';
import User from '@/models/userModel';
import { systemLogs } from '@/utils/Logger';

interface DecodedToken extends JwtPayload {
    id: string;
}

const newAccessToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const cookies = req.cookies;

        if (!cookies?.jwtVilla) {
            res.sendStatus(401);
            return;
        }

        const refreshToken = cookies.jwtVilla;

        const options: CookieOptions = {
            httpOnly: true,
            // maxAge: 0,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        };
        res.clearCookie('jwtVilla', options);

        const existingUser = await User.findOne({ refreshToken }).exec();

        if (!existingUser) {
            try {
                const decoded = jwt.verify(
                    refreshToken,
                    process.env.JWT_REFRESH_SECRET_KEY!,
                ) as DecodedToken;

                const hackedUser = await User.findOne({
                    _id: decoded.id,
                }).exec();

                if (hackedUser) {
                    hackedUser.refreshToken = [];
                    await hackedUser.save();
                }
            } catch (error) {
                console.log(error);
            }
            res.sendStatus(403);
            return;
        }

        const newRefreshTokenArray = existingUser.refreshToken.filter(
            (refT) => refT !== refreshToken,
        );

        try {
            const decoded = jwt.verify(
                refreshToken,
                process.env.JWT_REFRESH_SECRET_KEY!,
            ) as DecodedToken;

            if (existingUser._id.toString() !== decoded.id) {
                res.sendStatus(403);
                return;
            }

            const accessToken = jwt.sign(
                {
                    id: existingUser._id,
                    roles: existingUser.roles,
                },
                process.env.JWT_ACCESS_SECRET_KEY!,
                { expiresIn: '10m' },
            );

            const newRefreshToken = jwt.sign(
                { id: existingUser._id },
                process.env.JWT_REFRESH_SECRET_KEY!,
                { expiresIn: '1d' },
            );

            existingUser.refreshToken = [
                ...newRefreshTokenArray,
                newRefreshToken,
            ];
            await existingUser.save();

            res.cookie('jwtVilla', newRefreshToken, options);
            res.json({
                success: true,
                firstName: existingUser.firstName,
                lastName: existingUser.lastName,
                username: existingUser.username,
                provider: existingUser.provider,
                avatar: existingUser.avatar,
                accessToken,
            });
        } catch (error) {
            existingUser.refreshToken = [...newRefreshTokenArray];
            await existingUser.save();
            //  res.status(403).json({ message: `Refresh token error ${error}` });
        }
    } catch (error) {
        res.sendStatus(500);
        systemLogs.error(`newAccessToken, ${error}`);
        //   return;
    }
};

export default newAccessToken;
