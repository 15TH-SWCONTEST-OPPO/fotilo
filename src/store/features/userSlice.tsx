import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '..';
import {userType} from '../../static/types';

const initialState: userType = {
  username: "",
  userID:"",
  phone:""
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    set: (state, action: PayloadAction<Partial<userType>>) => {
      for(let key in action.payload){
        state[key]=action.payload[key];
      }
    },
  },
});

export const {set} = userSlice.actions;
export const user = (state: RootState) => state.user;
export default userSlice.reducer;
