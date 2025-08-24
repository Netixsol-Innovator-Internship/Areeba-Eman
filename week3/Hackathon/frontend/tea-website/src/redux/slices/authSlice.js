import { createSlice } from '@reduxjs/toolkit';

const tokenFromLS = localStorage.getItem('token');
const userFromLS = localStorage.getItem('user');

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  // user: userFromLS ? JSON.parse(userFromLS) : null,
  // token: tokenFromLS || null,
  // isAuthenticated: !!tokenFromLS,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, user } = action.payload || {};
      state.token = token || null;
      state.user = user || null;
      state.isAuthenticated = !!token;
      if (token) localStorage.setItem('token', token);
      if (user) localStorage.setItem('user', JSON.stringify(user));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('authChange'));
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
