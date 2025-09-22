import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const researchApi = createApi({
  reducerPath: "researchApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4000/" }),
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
