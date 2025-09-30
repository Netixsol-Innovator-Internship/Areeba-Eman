import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const cricketApi = createApi({
  reducerPath: 'cricketApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL }),
  endpoints: (builder) => ({
    askQuestion: builder.mutation<{ answer: string }, { question: string }>({
    query: (body) => ({
      url: '/cricket/ask',
      method: 'POST',
      body,
    }),
  }),
  }),
});

export const { useAskQuestionMutation } = cricketApi;
