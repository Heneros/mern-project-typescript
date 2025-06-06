import { NextFunction, Request, Response } from 'express';
import { ADMIN, USER } from '../constants/index';
import { IUser } from '@/backend/types/IUser';

const ROLES = {
    User: USER,
    Admin: ADMIN,
};

const checkRole =
    (...allowedRoles: string[]) =>
    (req: Request, res: Response, next: NextFunction) => {
        const requestWithRoles = req as Request & {
            roles: string[];
            user: IUser;
        };

        if (!requestWithRoles.user || !requestWithRoles.roles) {
            res.status(401);
            throw new Error('You are not authorized to use our platform');
        }

        const rolesArray = [...allowedRoles];
        const roleFound = requestWithRoles.roles.some((role) =>
            rolesArray.includes(role),
        );

        if (!roleFound) {
            res.status(401);
            throw new Error('You are not authorized to perform this request');
        }
        next();
    };

const role = { ROLES, checkRole };

export default role;
