import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '..';

const initialState: {show: boolean; videoId: string} = {
  show: false,
  videoId: '',
};

const shareSlice = createSlice({
  name: 'share',
  initialState,
  reducers: {
    set: (state, action: PayloadAction<boolean>) => {
      state.show = action.payload;
    },
    setVideoId: (state, action: PayloadAction<string>) => {
      state.videoId = action.payload;
    },
  },
});

export const {set,setVideoId} = shareSlice.actions;
export const share = (state: RootState) => state.share;
export default shareSlice.reducer;
