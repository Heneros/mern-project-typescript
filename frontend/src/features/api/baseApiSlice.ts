import {
    createApi,
    fetchBaseQuery,
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError
} from '@reduxjs/toolkit/query/react';
import type { RootState } from 'shared/lib/reducer';

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:1997/api/v1',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const state = getState() as RootState;
        const token = state.auth.user?.accessToken;
        const googleToken = state.auth?.googleToken;

        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        } else if (googleToken) {
            headers.set('Authorization', `Bearer ${googleToken}`);
        }
        return headers;
    },
});

const baseQueryWithRefreshToken: BaseQueryFn<
    string | FetchArgs,

    // unknown: This indicates that the second argument (api) to the function can have any type
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let response = await baseQuery(args, api, extraOptions);
    return response;
};

const baseApiSlice = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithRefreshToken,
    tagTypes: ["User", "Property"],
    endpoints: (builder) => ({}),
});

export default baseApiSlice;
