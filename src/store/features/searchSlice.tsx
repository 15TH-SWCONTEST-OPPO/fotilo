import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '..';
import { videoType } from '../../static/types';

const initialState: {videos: videoType[];} = {
  videos: [],
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    set: (state, action: PayloadAction<videoType[]>) => {
      state.videos= [...action.payload];
    }
  },
});

export const {set} = searchSlice.actions;
export const search = (state: RootState) => state.search;
export default searchSlice.reducer;
