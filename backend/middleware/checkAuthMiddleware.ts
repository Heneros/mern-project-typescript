import asyncHandler from 'express-async-handler';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../models/userModel';

interface ExtendedRequest extends Request {
    user?: any;
    roles?: string[];
}

const checkAuth = asyncHandler(
    async (
        req: ExtendedRequest,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        // let jwtToken: string | undefined;
        let jwtToken: string | undefined;

        const authHeader =
            req.headers.authorization || req.headers.Authorization;

        if (
            typeof authHeader !== 'string' ||
            !authHeader.startsWith('Bearer ')
        ) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        if (typeof authHeader === 'string') {
            jwtToken = authHeader.split(' ')[1];
        }
 
        if (!jwtToken) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        try {
            const decoded = jwt.verify(
                jwtToken,
                process.env.JWT_ACCESS_SECRET_KEY!,
            );

            if (decoded && typeof decoded === 'object' && 'id' in decoded) {
                const userId = decoded.id;
                req.user = await User.findById(userId).select('-password');
                req.roles = decoded.roles;
                next();
            } else {
                res.sendStatus(403);
            }
        } catch (err) {
            res.sendStatus(403);
        }
    },
);

export default checkAuth;
