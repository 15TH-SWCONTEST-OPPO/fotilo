import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice';
import imgCReducer from './features/imgCSlice';
const store = configureStore({
    reducer: {
        user:userReducer,
        imgC:imgCReducer
    },
}); 

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export default store