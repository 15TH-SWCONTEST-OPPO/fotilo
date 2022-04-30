import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '..';
import {bulletScreenType} from '../../static/types';


const initialState: bulletScreenType = {
  userId: '',
  content: '',
  color: '',
  duration: 0,
  videoId:0
};

const bulletSlice = createSlice({
  name: 'bulletScreen',
  initialState,
  reducers: {
    set: (state, action: PayloadAction<bulletScreenType>) => {
      for (let key in action.payload) {
        state[key] = action.payload[key];
      }
    },
  },
});

export const {set} = bulletSlice.actions;
export const bulletScreen = (state: RootState) => state.bulletScreen;
export default bulletSlice.reducer;
