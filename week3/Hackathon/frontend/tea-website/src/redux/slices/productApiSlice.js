// src/redux/slices/productApiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApiSlice = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api"  }),
  tagTypes: ["Products", "Collections"],
  endpoints: (builder) => ({
    getCollections: builder.query({
      query: () => "/products/collections",
      providesTags: ["Collections"],
    }),
    getProducts: builder.query({
      query: () => "/products",
      providesTags: ["Products"],
    }),
    getProductBySlug: builder.query({
      query: (slug) => `/products/${slug}`,
      providesTags: ["Products"],
    }),
    getFilterOptions: builder.query({
      query: () => "/filters", // Make sure your backend supports this route
    }),
    getFilteredProducts: builder.query({
      query: (filterParams) => `/products?${filterParams}`, 
      providesTags: ["Products"],
    }),
    addProduct: builder.mutation({
      query: (newProduct) => ({
        url: "/products",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Products"],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...updatedProduct }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: updatedProduct,
      }),
      invalidatesTags: ["Products"],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
  }),
});

export const {
  useGetCollectionsQuery,
  useGetProductsQuery,
  useGetProductBySlugQuery,
  useGetFilterOptionsQuery,
  useLazyGetFilteredProductsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApiSlice;
