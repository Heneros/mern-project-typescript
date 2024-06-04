import { createSlice } from '@reduxjs/toolkit';



export interface RootState {
  auth: {
    user?: {
      accessToken: string;
    };
  };
}