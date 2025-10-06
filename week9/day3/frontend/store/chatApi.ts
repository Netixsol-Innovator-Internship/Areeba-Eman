import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://your-backend-url.com",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Conversations", "Chat"],
  endpoints: (builder) => ({
    // ✅ get all conversation metadata
    getConversations: builder.query<any[], void>({
      query: () => "/conversations",
      providesTags: ["Conversations"],
    }),

    // ✅ get single chat messages
    getChatHistory: builder.query<any, string>({
      query: (chatId) => `/conversations/${chatId}`,
      providesTags: ["Chat"],
    }),

    // ✅ ask question (new or existing chat)
    askQuestion: builder.mutation<any, { chatId?: string; question: string }>({
      query: (body) => ({
        url: "/cricket/ask",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Conversations", "Chat"],
    }),

    // ✅ delete a chat
    deleteChat: builder.mutation<void, string>({
      query: (chatId) => ({
        url: `/conversations/${chatId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Conversations"],
    }),

    // ✅ clear all chats
    clearChats: builder.mutation<void, void>({
      query: () => ({
        url: `/conversations`,
        method: "DELETE",
      }),
      invalidatesTags: ["Conversations"],
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetChatHistoryQuery,
  useAskQuestionMutation,
  useDeleteChatMutation,
  useClearChatsMutation,
} = chatApi;
