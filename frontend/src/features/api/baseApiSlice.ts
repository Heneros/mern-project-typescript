import {
    createApi,
    fetchBaseQuery,
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { BASE_URL } from 'shared/consts/urls';
import type { RootState } from 'shared/lib/reducer';

const baseQuery = fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/v1`,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const state = getState() as RootState;
        const token = state.auth.user?.accessToken;
        const googleToken = state.auth?.googleToken;
        //    const githubToken = state.auth?.githubToken;
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        } else if (googleToken) {
            headers.set('authorization', `Bearer ${googleToken}`);
        }
        //  else if (githubToken) {
        //     headers.set('authorization', `Bearer ${githubToken}`);
        // }
        return headers;
    },
});

const baseQueryWithRefreshToken: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let response = await baseQuery(args, api, extraOptions);
    return response;
};

const baseApiSlice = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithRefreshToken,
    tagTypes: ['User', 'Property'],
    endpoints: (builder) => ({}),
});

export default baseApiSlice;
