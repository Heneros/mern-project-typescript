import baseApiSlice from 'features/api/baseApiSlice';
import { User } from 'shared/types';

interface GetAllUsersResult {
    users: User[];
    numberOfPages: number;
    count: number;
    success: boolean;
}

export const usersApiSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllUsers: builder.query<GetAllUsersResult, string>({
            query: () => ({
                url: '/user/all',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: (result) =>
                result
                    ? [
                          ...result.users.map(({ id }) => ({
                              type: 'User' as const,
                              id: id as string | number,
                          })),
                          { type: 'User', id: 'LIST' },
                      ]
                    : [{ type: 'User', id: 'LIST' }],
        }),
        getUserProfile: builder.query({
            query: () => `/user/profile`,
            providesTags: [{ type: 'User', id: 'SINGLE_USER' }],
        }),
        updateUserProfile: builder.mutation({
            query: (profileData) => ({
                url: '/user/profile',
                method: 'PATCH',
                body: profileData,
                credentials: 'include',
            }),
            invalidatesTags: [{ type: 'User', id: 'SINGLE_USER' }],
        }),
        updateProfileAvatar: builder.mutation({
            query: (formData) => ({
                url: '/upload',
                method: 'PATCH',
                credentials: 'include',
                body: formData,
            }),
        }),
        deleteMyAccount: builder.mutation({
            query: () => ({
                url: '/user/profile',
                method: 'DELETE',
            }),
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/user/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'User', id: 'LIST' }],
        }),
        deactivateUser: builder.mutation({
            query: (id) => ({
                url: `/user/${id}/deactivate`,
                method: 'PATCH',
                credentials: 'include',
                // body: formData,
            }),
            invalidatesTags: [{ type: 'User', id: 'LIST' }],
        }),
    }),
});

export const {
    useDeactivateUserMutation,
    useDeleteMyAccountMutation,
    useDeleteUserMutation,
    useGetAllUsersQuery,
    useUpdateUserProfileMutation,
    useGetUserProfileQuery,
} = usersApiSlice;
