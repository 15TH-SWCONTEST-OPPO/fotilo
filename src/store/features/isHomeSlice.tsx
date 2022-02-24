import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '..';

interface IsHomeSlice {
  isHome: boolean;
}

const initialState: IsHomeSlice = {
  isHome: false,
};

const isHomeSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    set: (state, action: PayloadAction<boolean>) => {
      state.isHome = action.payload;
    },
  },
});

export const {set} = isHomeSlice.actions;
export const isHome = (state: RootState) => state.isHome;
export default isHomeSlice.reducer;
