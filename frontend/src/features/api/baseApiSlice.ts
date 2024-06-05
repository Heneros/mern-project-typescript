import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from 'shared/lib/reducer';
import { createSlice } from '@reduxjs/toolkit';

const baseQuery = fetchBaseQuery({
    baseUrl: '/api/v1',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = getState<RootState>().auth.user?.accessToken;
    },
});

