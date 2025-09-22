import { configureStore } from "@reduxjs/toolkit";
import { researchApi } from "./researchApi";

export const store = configureStore({
  reducer: {
    [researchApi.reducerPath]: researchApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(researchApi.middleware),
});
