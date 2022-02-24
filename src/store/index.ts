import { configureStore } from '@reduxjs/toolkit';
import isHomeReducer from './features/isHomeSlice';
const store = configureStore({
    reducer: {
        isHome:isHomeReducer
    },
}); 

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export default store