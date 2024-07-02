import { combineReducers, configureStore } from '@reduxjs/toolkit'
import baseApiSlice from 'features/api/baseApiSlice';
import authReducer from 'features/auth/authSlice';
import propertyReducer from 'features/properties/propertySlice';

// const rootReducer = combineReducer({

// });

const store = configureStore({
    reducer: {
[     baseApiSlice.reducerPath]: baseApiSlice.reducer,
      auth: authReducer,
      properties: propertyReducer
    },
    middleware:(getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApiSlice.middleware),
    devTools: true
})

export default store;