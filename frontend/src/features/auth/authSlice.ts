import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { decodeToken } from 'react-jwt';
import { User } from 'shared/types/User';

// userString должен быть строкой, так как localStorage.getItem возвращает строку или null. Если localStorage не содержит значения для "user", вы предоставляете пустой массив [] в качестве значения по умолчанию. Это приведет к ошибке, потому что массив не может быть назначен строковой переменной.
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

export const selectCurrentUserToken = (state: { auth: AuthSlice }) =>
    state.auth.user?.accessToken;
export const selectCurrentUserGoogleToken = (state: { auth: AuthSlice }) =>
    state.auth.user?.googleToken;
