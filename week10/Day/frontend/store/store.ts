import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import { productsApi } from '@/features/products/productsApi';
import { authApi } from '@/features/auth/authApi';
import chatReducer from "@/features/chat/chatSlice";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    auth: authReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, productsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
