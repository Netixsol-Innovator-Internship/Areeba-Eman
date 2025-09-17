// redux/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // store user info here
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null; // just clear state
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
