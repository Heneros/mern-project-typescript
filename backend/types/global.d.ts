import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: any;
            files?: any;
        }

        namespace Multer {
            interface File {
                fieldname: string;
                originalname: string;
                encoding: string;
                mimetype: string;
                size: number;
                destination: string;
                filename: string;
                path: string;
                buffer: Buffer;
            }
        }
    }
}

export interface ExtendedRequest extends Request {
    user?: any;
    headers: any;
}

export interface DecodedToken extends JwtPayload {
    userId: string;
    email: string;
    role?: string;
}

export type AsyncHandler = (
    req: Request,
    res: Response,
    next: NextFunction,
) => Promise<void>;

export {};
