import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  token: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload.token)
      }
    },
    loadToken: (state) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token')
        if (token) {
          state.token = token
        }
      }
    },
    logout: (state) => {
      state.token = null
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
      }
    },
  },
})

export const { setCredentials, loadToken, logout } = authSlice.actions
export default authSlice.reducer
