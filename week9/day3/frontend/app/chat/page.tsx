"use client";
import { useEffect, useState } from "react";
import ChatWindow from "@/components/ChatWindow";
import Sidebar from "@/components/Slidebar";
import Navbar from "@/components/NavBar";

export default function ChatPage() {
  const [isClient, setIsClient] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => setIsClient(true), []); 

  if (!isClient) return null; // avoids hydration mismatch

  const handleNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/4 border-r bg-gray-50 dark:bg-gray-900 overflow-y-auto p-4">
          <Sidebar
            activeChatId={activeChatId}
            setActiveChatId={setActiveChatId}
            onNewChat={handleNewChat}
          />
        </div>
        <div className="flex-1 flex flex-col">
          <ChatWindow
            activeChatId={activeChatId}
            setActiveChatId={setActiveChatId}
            messages={messages}
            setMessages={setMessages}
          />
        </div>
      </div>
    </div>
  );
}
