import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const cricketApi = createApi({
  reducerPath: 'cricketApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000' }),
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
