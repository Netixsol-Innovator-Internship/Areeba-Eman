import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/store/store";

export const askApi = createApi({
  reducerPath: "askApi",
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
    askQuestion: builder.mutation({
      query: ({ chatId, question }: { chatId?: string; question: string }) => ({
        url: "/cricket/ask",
        method: "POST",
        body: { chatId, question },
      }),
    }),
  }),
});

export const { useAskQuestionMutation } = askApi;
