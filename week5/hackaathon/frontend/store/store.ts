import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./authSlice"
import { api } from "../features/api/apiSlice" // your RTK Query API slice

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [api.reducerPath]: api.reducer, // <-- add this
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware), // <-- add this
})

// Optional types
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
