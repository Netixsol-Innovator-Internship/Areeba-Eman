import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const skincareApi = createApi({
  reducerPath: "skincareApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://makeup-api.herokuapp.com/api/v1/" }),
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (brand = "maybelline") => `products.json?brand=${brand}`,
    }),
  }),
});

export const { useGetProductsQuery } = skincareApi;
