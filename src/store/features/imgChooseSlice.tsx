import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '..';

const initialState: {show: boolean; pics: Array<any>;index:number} = {
  show: false,
  pics: [],
  index:0
};

const imgChooseSlice = createSlice({
  name: 'imgDrawer',
  initialState,
  reducers: {
    setShow: (state, action: PayloadAction<boolean>) => {
      state.show = action.payload;
    },
    setImgs: (state, action: PayloadAction<Array<any>>) => {
      console.log('update');
      
      state.pics = [...action.payload];
    },
    setIndex: (state, action: PayloadAction<number>) => {
      state.index = action.payload;
    },
  },
});

export const {setShow,setImgs,setIndex} = imgChooseSlice.actions;
export const imgDrawer = (state: RootState) => state.imgChoose;
export default imgChooseSlice.reducer;
