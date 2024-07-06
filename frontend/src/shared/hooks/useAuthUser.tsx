import React from 'react';
import { decodeToken } from 'react-jwt';
import {
    selectCurrentUserGoogleToken,
    selectCurrentUserToken,
} from 'features/auth/authSlice';
import { useAppSelector } from 'shared/lib/store';

interface DecodedToken {
    roles: string[];
}

export const useAuthUser = () => {
    const token = useAppSelector(selectCurrentUserToken);
    const googleToken = useAppSelector(selectCurrentUserGoogleToken);

    let isAdmin = false;
    let accessRight = 'User';

    if (token) {
        const decodedToken = decodeToken<DecodedToken>(token);

        if (decodedToken && 'roles' in decodedToken) {
            const { roles } = decodedToken as DecodedToken;
            isAdmin = decodedToken.roles.includes('Admin');
            if (isAdmin) accessRight = 'Admin';
            return { roles, isAdmin, accessRight };
        } else if (googleToken) {
            const gDecodedToken = decodeToken<DecodedToken>(googleToken);
            if (gDecodedToken && 'roles' in gDecodedToken) {
                const { roles } = gDecodedToken;
                isAdmin = gDecodedToken.roles.includes('Admin');
                if (isAdmin) accessRight = 'Admin';
                return { roles, isAdmin, accessRight };
            }
        }
        return { roles: [], isAdmin, accessRight };
    }
};
