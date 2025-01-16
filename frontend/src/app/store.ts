import { combineReducers, configureStore } from '@reduxjs/toolkit';

import baseApiSlice from 'features/api/baseApiSlice';
import authReducer from 'features/auth/authSlice';

import propertyReducer from 'features/properties/api/propertySlice';
import cartSlice from 'features/order/api/cartSlice';
// import chatReducer from 'features/chat/api/chatSlice';

const store = configureStore({
    reducer: {
        [baseApiSlice.reducerPath]: baseApiSlice.reducer,
        auth: authReducer,
        properties: propertyReducer,
        // chat: chatReducer,
        cart: cartSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApiSlice.middleware),
    devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
