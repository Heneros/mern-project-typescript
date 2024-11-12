import { decodeToken } from 'react-jwt';
import {
    selectCurrentUserGithubToken,
    selectCurrentUserGoogleToken,
    selectCurrentUserToken,
} from 'features/auth/authSlice';
import { useAppSelector } from 'shared/lib/store';

interface DecodedToken {
    id: string;
    roles: string[];
}

export const useUserRoles = () => {
    const token = useAppSelector(selectCurrentUserToken);
    const tokenGithub = useAppSelector(selectCurrentUserGithubToken);
    const tokenGoogle = useAppSelector(selectCurrentUserGoogleToken);

    let isAdmin = false;
    let isEditor = false;
    let userId: string | null = null;

    const decodeAndSetRoles = (token: string | null) => {
        if (token) {
            const decodedToken = decodeToken<DecodedToken>(token);
            if (decodedToken) {
                const { id, roles } = decodedToken;
                userId = id;
                isAdmin = roles.includes('Admin');
                isEditor = roles.includes('Editor');
            }
        }
    };
    if (token) decodeAndSetRoles(token);
    if (!isAdmin && !isEditor) decodeAndSetRoles(tokenGithub);
    if (!isAdmin && !isEditor) decodeAndSetRoles(tokenGoogle);

    return { isAdmin, isEditor, userId };
};
