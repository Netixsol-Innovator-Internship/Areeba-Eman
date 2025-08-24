import { configureStore } from "@reduxjs/toolkit";
import { cartApi } from "./slices/cartApiSlice";
import { productApiSlice } from "./slices/productApiSlice";
import { userApi } from "./slices/userApiSlice";
import authReducer from './slices/authSlice';
import { authApi } from './slices/authApiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer, 
    [productApiSlice.reducerPath]: productApiSlice.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(productApiSlice.middleware)
      .concat(cartApi.middleware)
      .concat(userApi.middleware),
});



// export const store = configureStore({
//   reducer: {
//     [cartApi.reducerPath]: cartApi.reducer,
//     [productApiSlice.reducerPath]: productApiSlice.reducer,
//     [userApi.reducerPath]: userApi.reducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(
//       cartApi.middleware,
//       productApiSlice.middleware,
//       userApi.middleware
//     ),
// });
