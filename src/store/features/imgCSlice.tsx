import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '..';

interface imgCType {
  iniPic: any;
  show: boolean;
  resFile?: any;
  scale: number;
}

const initialState: imgCType = {
  iniPic: null,
  show: false,
  scale: 1,
};

const imgCSlice = createSlice({
  name: 'imgC',
  initialState,
  reducers: {
    set: (state, action: PayloadAction<Partial<imgCType>>) => {
      state.iniPic = action.payload.iniPic;
      state.show = action.payload.show||false;
      state.scale = action.payload.scale||0;
    },
    setResFile: (state, action: PayloadAction<any>) => {
      state.resFile = action.payload;
    },
  },
});

export const {set, setResFile} = imgCSlice.actions;
export const imgC = (state: RootState) => state.imgC;
export default imgCSlice.reducer;
