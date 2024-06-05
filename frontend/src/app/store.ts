import { combineReducers, configureStore } from '@reduxjs/toolkit'
import baseApiSlice from 'features/api/baseApiSlice';


// const rootReducer = combineReducer({

// });

const store = configureStore({
    reducer: {
[     baseApiSlice.reducerPath]: baseApiSlice.reducer,
    },
    // middleware:(getDe)
})

export default store;