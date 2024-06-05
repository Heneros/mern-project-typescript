import { combineReducers, configureStore } from '@reduxjs/toolkit'


const rootReducer = combineReducer({

});

const store = configureStore({
    reducer,
    middleware:(getDe)
})

export default store;