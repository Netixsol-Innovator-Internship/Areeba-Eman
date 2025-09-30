import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from "@/store/store";

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
     baseUrl: process.env.NEXT_PUBLIC_API_URL,
      prepareHeaders: (headers, { getState }) => {
           const token = (getState() as RootState).auth.token;
           if (token) {
             headers.set("Authorization", `Bearer ${token}`);
           }
           return headers;
      },
    }),
  endpoints: (builder) => ({
    login: builder.mutation<{ access_token: string }, { email: string; password: string }>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),
    signup: builder.mutation<{ token: string }, { email: string; password: string }>({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useLoginMutation, useSignupMutation } = apiSlice;
