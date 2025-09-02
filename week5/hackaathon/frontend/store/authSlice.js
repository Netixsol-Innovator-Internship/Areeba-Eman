// store/authSlice.js
import { createSlice } from "@reduxjs/toolkit"

const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

const authSlice = createSlice({
  name: "auth",
  initialState: { token, isLoggedIn: !!token },
  reducers: {
    login(state, action) {
      state.token = action.payload
      state.isLoggedIn = true
    },
    logout(state) {
      state.token = null
      state.isLoggedIn = false
    }
  }
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer
