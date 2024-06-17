import baseApiSlice from "features/api/baseApiSlice";
import { logOut } from "./authSlice";


export const authApiSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) =>({
        registerUser: builder.mutation({
            query: (userData) =>({
                url: '/auth/register',
                method: 'POST',
                body: userData
            })
        })
    })
})

export const { useRegisterUserMutation }  = authApiSlice;