import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '..';

const initialState: {show: boolean; pics: Array<any>;type:'photo'|'video'} = {
  show: false,
  pics: [],
  type:'photo'
};

const imgDrawerSlice = createSlice({
  name: 'imgDrawer',
  initialState,
  reducers: {
    set: (state, action: PayloadAction<boolean>) => {
      state.show = action.payload;
    },
    setImg: (state, action: PayloadAction<Array<any>>) => {
      state.pics = [...action.payload];
    },
    setType: (state, action: PayloadAction<'photo'|'video'>) => {
      state.type = action.payload;
    },
  },
});

export const {set,setImg,setType} = imgDrawerSlice.actions;
export const imgDrawer = (state: RootState) => state.imgDrawer;
export default imgDrawerSlice.reducer;
