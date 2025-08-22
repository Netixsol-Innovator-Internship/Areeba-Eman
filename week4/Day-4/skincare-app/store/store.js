"use client";
import { configureStore } from "@reduxjs/toolkit";
import { skincareApi } from "../features/api/skincareApi";
import favouritesReducer from "../features/favourites/favouritesSlice";

export const store = configureStore({
  reducer: {
    [skincareApi.reducerPath]: skincareApi.reducer,
    favourites: favouritesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(skincareApi.middleware),
});
