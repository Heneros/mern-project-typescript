import React from 'react';
import { decodeToken } from 'react-jwt';
import {
    selectCurrentUserGithubToken,
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
    const githubToken = useAppSelector(selectCurrentUserGithubToken);

    let isAdmin = false;
    let isEditor = false;
    let accessRight = 'User';
    // console.log('Decoded Github Token:', token, githubToken);
    if (token) {
        const decodedToken = decodeToken<DecodedToken>(token);

        if (decodedToken && 'roles' in decodedToken) {
            const { roles } = decodedToken as DecodedToken;
            isAdmin = decodedToken.roles.includes('Admin');
            if (isAdmin) accessRight = 'Admin';
            return { roles, isAdmin, accessRight };
        }

        return { roles: [], isAdmin, accessRight };
    } else if (googleToken) {
        const gDecodedToken = decodeToken<DecodedToken>(googleToken);
        if (gDecodedToken && 'roles' in gDecodedToken) {
            const { roles } = gDecodedToken;
            isAdmin = gDecodedToken.roles.includes('Admin');
            if (isAdmin) accessRight = 'Admin';
            return { roles, isAdmin, accessRight };
        }
    } else if (githubToken) {
        const gitDecodedToken = decodeToken<DecodedToken>(githubToken);

        // console.log('Decoded Github Token:', gitDecodedToken);
        if (gitDecodedToken && 'roles' in gitDecodedToken) {
            const { roles } = gitDecodedToken;
            isAdmin = gitDecodedToken.roles.includes('Admin');
            if (isAdmin) accessRight = 'Admin';
            return { roles, isAdmin, accessRight };
        }
    }
    return { roles: [], isAdmin, accessRight };
};
