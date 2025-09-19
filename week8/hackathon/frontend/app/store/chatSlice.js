import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    pdfId: null,
    messages: [],
    metadata: null,   // ✅ new field for summary/highlights/category
  },
  reducers: {
    setPdfId: (state, action) => { state.pdfId = action.payload },
    addMessage: (state, action) => { state.messages.push(action.payload) },
    clearChat: (state) => { state.messages = []; state.pdfId = null; state.metadata = null },
    setMetadata: (state, action) => { state.metadata = action.payload }, // ✅
  },
});

export const { setPdfId, addMessage, clearChat, setMetadata } = chatSlice.actions;
export default chatSlice.reducer;
