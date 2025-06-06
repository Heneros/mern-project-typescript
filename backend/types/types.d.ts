import { IUser } from '@/backend/types/IUser';

declare global {
    namespace Express {
        export interface Request {
            user: IUser;
        }
    }
}

export {};
