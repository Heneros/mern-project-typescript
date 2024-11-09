import {
    selectCurrentUserGithubToken,
    selectCurrentUserGoogleToken,
    selectCurrentUserToken,
} from 'features/auth/authSlice';
import React, { useEffect, useState } from 'react';
import { decodeToken } from 'react-jwt';
import { useAppSelector } from 'shared/lib/store';

interface DecodedToken {
    id: string;
}

const CheckUser = () => {
    const token = useAppSelector(selectCurrentUserToken);
    const tokenGoogle = useAppSelector(selectCurrentUserGoogleToken);
    const tokenGithub = useAppSelector(selectCurrentUserGithubToken);

    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        if (token || tokenGoogle || tokenGithub) {
            const decodedToken = token
                ? decodeToken<DecodedToken>(token)
                : null;
            const decodedTokenGoogle = tokenGoogle
                ? decodeToken<DecodedToken>(tokenGoogle)
                : null;
            const decodedTokenGithub = tokenGithub
                ? decodeToken<DecodedToken>(tokenGithub)
                : null;

            const userToken =
                decodedToken?.id ||
                decodedTokenGoogle?.id ||
                decodedTokenGithub?.id;
            if (userToken) setUserId(userToken);
        }
    }, [token, tokenGoogle, tokenGithub]);

    return <div></div>;
};

export default CheckUser;
