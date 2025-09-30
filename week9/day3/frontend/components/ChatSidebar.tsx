"use client";

import { useAppSelector, useAppDispatch } from "../store/hooks";
import { setChatId } from "@/features/chatSlice";

export default function ChatSidebar({
  onSelectChat,
}: {
  onSelectChat: (chatId: string) => void;
}) {
  const chats = useAppSelector((state) => state.chat.chats);
  const dispatch = useAppDispatch();

  const handleSelect = (chatId: string) => {
    dispatch(setChatId(chatId));
    onSelectChat(chatId);
  };

  return (
    <div className="w-64 border-r h-full p-2">
      <h2 className="font-bold mb-4">Chats</h2>
      {chats.map((chat) => (
        <div
          key={chat.chatId}
          className="p-2 cursor-pointer hover:bg-gray-200 rounded"
          onClick={() => handleSelect(chat.chatId)}
        >
          {chat.title || chat.chatId}
        </div>
      ))}
    </div>
  );
}
