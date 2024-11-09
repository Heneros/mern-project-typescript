import {
    selectCurrentUserGithubToken,
    selectCurrentUserGoogleToken,
    selectCurrentUserToken,
} from 'features/auth/authSlice';
import React from 'react';
import { useAppSelector } from 'shared/lib/store';

const NavMenu = () => {
    const token = useAppSelector(selectCurrentUserToken);
    const tokenGithub = useAppSelector(selectCurrentUserGithubToken);
    const tokenGoogle = useAppSelector(selectCurrentUserGoogleToken);

    return <div>NavMenu</div>;
};

export default NavMenu;
