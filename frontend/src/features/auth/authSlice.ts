import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { decodeToken } from 'react-jwt';
import { User } from 'shared/types/User';

interface AuthSlice {
    user: User | null;
    googleToken: string | null;
    githubToken: string | null;
}

const userToken = localStorage.getItem('user');
const googleToken = localStorage.getItem('googleToken');
const githubToken = localStorage.getItem('githubToken');

let parsedUser: User | null = null;

try {
    parsedUser = userToken ? JSON.parse(userToken) : null;
} catch (e) {
    console.error('Error parsing stored user:', e);
}

const initialState: AuthSlice = {
    user: parsedUser,
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
            //  localStorage.setItem('user', JSON.stringify(action.payload));
        },
        updateGithubToken: (state, action: PayloadAction<string>) => {
            state.githubToken = action.payload;
            localStorage.setItem('githubToken', action.payload);
            // localStorage.setItem('user', JSON.stringify(action.payload));
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
}): string | null => {
    // const googleToken = state.auth.user?.googleToken;
    // return Array.isArray(googleToken) ? googleToken[0] : googleToken;
    return state.auth.googleToken;
};

export const selectCurrentUserGithubToken = (state: {
    auth: AuthSlice;
}): string | null => {
    //  return state.auth.githubToken;
    return state.auth.githubToken;
};
