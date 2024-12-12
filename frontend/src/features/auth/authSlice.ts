import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import socket from 'app/socket'; // Ensure this imports a valid socket instance
import { decodeToken, isExpired } from 'react-jwt';
import { BASE_URL } from 'shared/consts/urls';
import { User } from 'shared/types/User';
import axios from 'axios';
import { Socket } from 'socket.io-client'; // Import Socket type

interface AuthSlice {
    user: User | null;
    isAuthenticated: boolean;
    googleToken: string | null;
    githubToken: string | null;

    authUser?: any;
    isCheckingAuth?: boolean;
    socket?: Socket | null; // Use Socket type here

    onlineUsers: string[];
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

const isAuthenticated = !!(
    (userToken && !isExpired(userToken)) ||
    (googleToken && !isExpired(googleToken)) ||
    (githubToken && !isExpired(githubToken))
);

const initialState: AuthSlice = {
    isAuthenticated,
    user: parsedUser,
    googleToken: googleToken ?? null,
    githubToken: githubToken ?? null,

    authUser: null,
    isCheckingAuth: true,
    socket: null,
    onlineUsers: [],
};

export const checkAuth = createAsyncThunk(
    'auth/checkAuth',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get(`${BASE_URL}/auth/check`);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data.message || 'Error checking auth',
            );
        }
    },
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthenticated(state, action: PayloadAction<boolean>) {
            state.isAuthenticated = action.payload;
        },
        logIn: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        logOut: (state) => {
            state.user = null;
            state.googleToken = null;
            state.githubToken = null;
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

        setAuthUser(state, action) {
            state.authUser = action.payload;
        },
        setOnlineUsers(state, action) {
            state.onlineUsers = action.payload;
        },
        connectSocket(state) {
            // if (state.socket?.connected) return;
            // socket.on('connection', () => {
            //     //
            //     state?.socket = socket;
            //     console.log('Socket connected');
            // });
            // socket.on('getOnlineUsers', (userIds) => {
            //     state.onlineUsers = userIds;
            // });
        },
        disconnectSocket(state) {
            state.socket?.disconnect();
            state.socket = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkAuth.pending, (state) => {
                state.isCheckingAuth = true;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.authUser = action.payload;
                state.isCheckingAuth = false;

                socket.emit('join', { userId: action.payload._id });
            })
            .addCase(checkAuth.rejected, (state) => {
                state.authUser = null;
                state.isCheckingAuth = false;
            });
    },
});

export const {
    logIn,
    logOut,
    setAuthenticated,
    updateGoogleToken,
    updateGithubToken,

    setAuthUser,
    connectSocket,
    disconnectSocket,
    setOnlineUsers,
} = authSlice.actions;

export default authSlice.reducer;

export const selectIsAuthenticated = (state: { auth: AuthSlice }) =>
    state.auth.isAuthenticated;

export const selectCurrentUserToken = (state: {
    auth: AuthSlice;
}): string | undefined => {
    const token = state.auth.user?.accessToken;
    return Array.isArray(token) ? token[0] : token;
};

export const selectCurrentUserGoogleToken = (state: {
    auth: AuthSlice;
}): string | null => state.auth.googleToken;

export const selectCurrentUserGithubToken = (state: {
    auth: AuthSlice;
}): string | null => state.auth.githubToken;
