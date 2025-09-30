import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/authSlice";
import chatReducer from "@/features/chatSlice";
import { apiSlice } from "./apiSlice";
import { conversationsApi } from "./conversationsApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [conversationsApi.reducerPath]: conversationsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware, conversationsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
