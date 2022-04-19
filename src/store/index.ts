import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice';
import imgCReducer from './features/imgCSlice';
import imgDrawerReducer from './features/imgDrawerSlice';
const store = configureStore({
    reducer: {
        user:userReducer,
        imgC:imgCReducer,
        imgDrawer:imgDrawerReducer
    },
}); 

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export default store