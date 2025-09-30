import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/store/store";

export const conversationsApi = createApi({
  reducerPath: "conversationsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
  const token = (getState() as RootState).auth.token || localStorage.getItem("token");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
    }
  }),
  tagTypes: ["Conversations"],
  endpoints: (builder) => ({
    getConversations: builder.query<any[], void>({
      query: () => "/conversations",
      providesTags: ["Conversations"],
    }),
    getConversationHistory: builder.query<any[], string>({
      query: (chatId) => `/conversations/${chatId}`,
      providesTags: (result, error, chatId) => [
        { type: "Conversations", id: chatId },
      ],
    }),
    saveConversation: builder.mutation({
      query: ({ chatId, question, answer }) => ({
        url: "/conversations",
        method: "POST",
        body: { chatId, question, answer },
      }),
      invalidatesTags: ["Conversations"],
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetConversationHistoryQuery,
  useSaveConversationMutation,
} = conversationsApi;
