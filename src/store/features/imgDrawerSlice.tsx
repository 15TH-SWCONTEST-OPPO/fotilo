import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '..';

const initialState: {show: boolean; pics: Array<any>} = {
  show: false,
  pics: [],
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
  },
});

export const {set,setImg} = imgDrawerSlice.actions;
export const imgDrawer = (state: RootState) => state.imgDrawer;
export default imgDrawerSlice.reducer;
