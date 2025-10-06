import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatState {
  activeChatId: string | null;
}

const initialState: ChatState = {
  activeChatId: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveChat: (state, action: PayloadAction<string | null>) => {
      state.activeChatId = action.payload;
    },
  },
});

export const { setActiveChat } = chatSlice.actions;
export default chatSlice.reducer;
