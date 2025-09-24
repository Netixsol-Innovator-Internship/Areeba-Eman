import { configureStore } from '@reduxjs/toolkit';
import { cricketApi } from './services/cricketApi';

export const store = configureStore({
  reducer: {
    [cricketApi.reducerPath]: cricketApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(cricketApi.middleware),
});

// Infer types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
