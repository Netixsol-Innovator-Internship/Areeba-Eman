// features/chat/chatSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ChatProduct {
  _id: string;
  name: string;
  price?: number | string;
  brand?: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  products?: ChatProduct[];
}

interface ChatState {
  chatId: string | null;
  messages: ChatMessage[];
  loading: boolean;
}

const initialState: ChatState = {
  chatId: null,
  messages: [],
  loading: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
    resetChat: (state) => {
      state.chatId = null;
      state.messages = [];
      state.loading = false;
    },
    setChatId: (state, action: PayloadAction<string>) => {
      state.chatId = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { addMessage, resetChat, setChatId, setLoading } = chatSlice.actions;
export default chatSlice.reducer;
