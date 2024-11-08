import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { decodeToken } from 'react-jwt';
import { User } from 'shared/types/User';

interface AuthSlice {
    user: User | null;
    googleToken?: string | null;
    githubToken?: string | null;
}

const userString = localStorage.getItem('user') || '';
const googleToken = localStorage.getItem('googleToken');
const githubToken = localStorage.getItem('githubToken');

let user: User | null = null;

if (userString) {
    try {
        user = JSON.parse(userString);
    } catch (error) {
        console.error('Error parsing user data:', error);
    }
}

const decodedToken: User | null = googleToken ? decodeToken(googleToken) : null;

const initialState: AuthSlice = {
    user:
        user ||
        (decodedToken && typeof decodedToken === 'object'
            ? decodedToken
            : null),
    googleToken: googleToken ?? null,
    githubToken: githubToken ?? null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logIn: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        logOut: (state) => {
            state.user = null;
            state.googleToken = null;
            localStorage.removeItem('user');
            localStorage.removeItem('googleToken');
            localStorage.removeItem('githubToken');
        },
        updateGoogleToken: (state, action: PayloadAction<string>) => {
            state.googleToken = action.payload;
            localStorage.setItem('googleToken', action.payload);
        },
        updateGithubToken: (state, action: PayloadAction<string>) => {
            state.githubToken = action.payload;
            localStorage.setItem('githubToken', action.payload);
        },
    },
});

export const { logIn, logOut, updateGoogleToken, updateGithubToken } =
    authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUserToken = (state: {
    auth: AuthSlice;
}): string | undefined => {
    const token = state.auth.user?.accessToken;
    return Array.isArray(token) ? token[0] : token;
};
export const selectCurrentUserGoogleToken = (state: {
    auth: AuthSlice;
}): string | undefined => {
    const googleToken = state.auth.user?.googleToken;
    return Array.isArray(googleToken) ? googleToken[0] : googleToken;
};

export const selectCurrentUserGithubToken = (state: {
    auth: AuthSlice;
}): string | undefined => {
    //  return state.auth.githubToken;
    const githubToken = state.auth.user?.githubToken;
    return Array.isArray(githubToken) ? githubToken[0] : githubToken;
};
