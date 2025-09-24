import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const researchApi = createApi({
  reducerPath: "researchApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://areeba-week5-day2-backend-production.up.railway.app" }),
  endpoints: (builder) => ({
    askQuestion: builder.mutation({
      query: (question) => ({
        url: "research/ask",
        method: "POST",
        body: { question },
      }),
    }),
    uploadDocument: builder.mutation({
      query: (doc) => ({
        url: "research/upload",
        method: "POST",
        body: doc,
      }),
    }),
  }),
});

export const { useAskQuestionMutation, useUploadDocumentMutation } = researchApi;
