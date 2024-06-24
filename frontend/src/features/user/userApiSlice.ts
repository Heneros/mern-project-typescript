import baseApiSlice from "features/api/baseApiSlice";
import { User } from "shared/types";


interface GetAllUsersResult {
    users: User[]
}


export const usersApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) =>({
    getAllUsers: builder.query<GetAllUsersResult, void>({
        query: ()=>({
            url: "/user/all",
            validateStatus: (response, result) =>{
                	return response.status === 200 && !result.isError;
            }
        }),
        // Этот код динамически генерирует теги для кэширования. Если результат запроса существует (result не null или undefined), он создает тег для каждого отдельного пользователя плюс общий тег для списка. Если результата нет, он возвращает только общий тег списка.
     providesTags: (result) => 
                result 
                    ? [
                        ...result.users.map(({ id }) => ({
                            type: "User" as const,
                            id: id as string | number,
                        })),
                        { type: "User", id: "LIST" }
                    ]
                    : [{ type: "User", id: "LIST" }]
    }),
    getUserProfile: builder.query({
 	query: () => "/user/profile",
    providesTags: [{type: "User", id: "SINGLE_USER"}]
    }),
    updateUserProfile: builder.mutation({
        query: (profileData) => ({
            url: '/user/profile',
            method: 'PATCH',
            body: profileData
        }),
        invalidatesTags: [{type: "User", id: "SINGLE_USER"}]
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
        invalidatesTags: [{type: 'User', id: "LIST"}]
    }),
    	deactivateUser: builder.mutation({
			query: (id) => ({
				url: `/user/${id}/deactivate`,
				method: "PATCH",
			}),
			invalidatesTags: [{ type: "User", id: "LIST" }],
		}),
  })
});

export const {useDeactivateUserMutation, useDeleteMyAccountMutation, useDeleteUserMutation, useGetAllUsersQuery, useGetUserProfileQuery } = usersApiSlice;