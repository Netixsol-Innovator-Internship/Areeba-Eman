import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Chat {
  chatId: string;
  title?: string;
}

interface ChatState {
  currentChatId: string | null;
  chats: Chat[];
}

const initialState: ChatState = {
  currentChatId: null,
  chats: [],
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChatId: (state, action: PayloadAction<string>) => {
      state.currentChatId = action.payload;
    },
    resetChatId: (state) => {
      state.currentChatId = null;
    },
    setChats: (state, action: PayloadAction<Chat[]>) => {
      state.chats = action.payload;
    },
  },
});

export const { setChatId, resetChatId, setChats } = chatSlice.actions;
export default chatSlice.reducer;
