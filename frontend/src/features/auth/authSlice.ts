import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { decodeToken } from 'react-jwt';
import { User } from 'shared/types/User';

const userString = localStorage.getItem('user') || '';
const googleToken = localStorage.getItem('googleToken');
let user: User | null = null;

if (userString) {
    try {
        user = JSON.parse(userString);
    } catch (error) {
        console.error('Error parsing user data:', error);
    }
}

const decodedToken: User | null = googleToken ? decodeToken(googleToken) : null;

interface AuthSlice {
    user: User | null;
    googleToken: string | null;
}

const initialState: AuthSlice = {
    user:
        user ||
        (decodedToken && typeof decodedToken === 'object'
            ? decodedToken
            : null),
    googleToken: googleToken ? googleToken : null,
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
        },
    },
});

export const { logIn, logOut } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUserToken = (state: { auth: AuthSlice }): string | undefined => {
    const token = state.auth.user?.accessToken;
    return Array.isArray(token) ? token[0] : token;
};
export const selectCurrentUserGoogleToken = (state: { auth: AuthSlice }): string | undefined =>{
   const googleToken  = state.auth.user?.googleToken;
   return Array.isArray(googleToken) ? googleToken[0] : googleToken;
}
  
 
