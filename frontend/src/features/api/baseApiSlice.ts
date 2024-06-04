import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import type { RootState } from 'shared/lib/reducer';
Object is of type 'unknown'.ts(2571)

import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

import type { RootState } from 'shared/lib/reducer';



const baseQuery = fetchBaseQuery({

    baseUrl: "/api/v1",

    credentials: 'include',

    prepareHeaders:(headers, {getState}) =>{

       const token = getState<RootState>().auth.user?.accessToken;

    }

}) import { createSlice } from '@reduxjs/toolkit';







export interface RootState {

  auth: {

    user?: {

      accessToken: string;

    };

  };

} 
const baseQuery = fetchBaseQuery({
    baseUrl: "/api/v1",
    credentials: 'include',
    prepareHeaders:(headers, {getState}) =>{
       const token = (getState() as RootState).auth.user?.accessToken;
    }
})