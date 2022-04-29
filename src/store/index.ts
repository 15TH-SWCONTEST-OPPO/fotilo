import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice';
import imgCReducer from './features/imgCSlice';
import imgDrawerReducer from './features/imgDrawerSlice';
import imgChooseReducer from './features/imgChooseSlice';
import shareReducer from './features/shareSlice';
import searchReducer from './features/searchSlice';
import bulletScreenReducer from './features/bulletScreenSlice';
const store = configureStore({
    reducer: {
        user:userReducer,
        imgC:imgCReducer,
        imgDrawer:imgDrawerReducer,
        imgChoose:imgChooseReducer,
        share:shareReducer,
        search:searchReducer,
        bulletScreen:bulletScreenReducer,
    },
}); 

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export default store