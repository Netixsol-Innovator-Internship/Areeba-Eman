"use client";

import { useState } from "react";
import { useAskQuestionMutation } from "../store/askApi";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setChatId } from "@/features/chatSlice";

export default function ChatInput({ onNewMessage }: { onNewMessage: (msg: any) => void }) {
  const [question, setQuestion] = useState("");
  const dispatch = useAppDispatch();
  const currentChatId = useAppSelector((state) => state.chat.currentChatId);

  const [askQuestion] = useAskQuestionMutation();

  const handleSend = async () => {
    if (!question.trim()) return;

    const response = await askQuestion({
      chatId: currentChatId || undefined,
      question,
    }).unwrap();

    onNewMessage({ question, answer: response.answer });

    if (!currentChatId && response.chatId) {
      dispatch(setChatId(response.chatId));
    }

    setQuestion("");
  };

  return (
    <div className="flex gap-2 p-2 border-t">
      <input
        type="text"
        className="flex-1 border rounded p-2"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Type your message..."
      />
      <button
        onClick={handleSend}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Send
      </button>
    </div>
  );
}
