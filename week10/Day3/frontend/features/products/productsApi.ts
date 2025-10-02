import { RootState } from '@/store/store';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Product {
  _id: string;
  name: string;
  category: string;
  brand: string;
  description?: string;
  price: number;
  ingredients?: string[];
  dosage?: string;
  stock: number;
}

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL, // your Nest backend UR
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => '/products',
    }),
    searchProducts: builder.query<Product[], string>({
      query: (q) => `/products/search?q=${encodeURIComponent(q)}`,
    }),
    aiSearch: builder.mutation<
      { query: string; keywords: string[]; products: Product[]; explanation: string },
      string
    >({
      query: (query) => ({
        url: '/products/ai-search',
        method: 'POST',
        body: { query },
      }),
    }),

    getProductById: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
    }),
  }),
});

export const {
  useGetProductsQuery,
  useSearchProductsQuery,
  useAiSearchMutation,
  useGetProductByIdQuery, 
} = productsApi;
