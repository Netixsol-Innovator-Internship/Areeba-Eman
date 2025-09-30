"use client";

import { useState, useEffect } from "react";
import { useAppDispatch } from "../../store/hooks";
import { setChats } from "@/features/chatSlice";
import ChatSidebar from "@/components/ChatSidebar";
import ChatWindow from "@/components/ChatWindow";
import ChatInput from "@/components/ChatInput";
import { useGetConversationsQuery } from "@/store/conversationsApi";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

export default function ChatPage() {
  const token = useSelector((state: RootState) => state.auth.token);
    const { data: conversations, isLoading } = useGetConversationsQuery(undefined, {
    skip: !token, 
   });
  const [messages, setMessages] = useState<any[]>([]);
  const [tokenLoaded, setTokenLoaded] = useState(false);
    useEffect(() => {
    if (token) setTokenLoaded(true);
  }, [token]);




  const dispatch = useAppDispatch();


  useEffect(() => {
    if (conversations) {
      dispatch(setChats(conversations.map((c) => ({ chatId: c.chatId, title: c.title }))));
    }
  }, [conversations, dispatch]);


  const handleNewMessage = (msg: any) => {
    setMessages((prev) => [...prev, msg]);
  };

  const handleSelectChat = (chatId: string) => {
    console.log("Selected chat:", chatId);
    // fetch messages for this chat if needed
  };

  return (
    <div className="flex h-screen">
      <ChatSidebar onSelectChat={handleSelectChat} />
      <div className="flex flex-col flex-1">
        <ChatWindow messages={messages} />
        <ChatInput onNewMessage={handleNewMessage} />
      </div>
    </div>
  );
}
