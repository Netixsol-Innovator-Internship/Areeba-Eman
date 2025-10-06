"use client";
import { useState } from "react";
import {
  useGetConversationsQuery,
  useDeleteChatMutation,
} from "@/store/chatApi";
import { MessageCircle, Plus, Trash2, Loader2 } from "lucide-react";

interface SidebarProps {
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
  onNewChat: () => void;
}

export default function Sidebar({
  activeChatId,
  setActiveChatId,
  onNewChat,
}: SidebarProps) {
  const { data: conversations, isLoading } = useGetConversationsQuery(undefined);
  const [deleteChat] = useDeleteChatMutation();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (chatId: string) => {
    if (!confirm("Are you sure you want to delete this chat?")) return;

    try {
      setDeletingId(chatId);
      await deleteChat(chatId).unwrap();
      if (activeChatId === chatId) setActiveChatId(null);
    } catch (err) {
      console.error("❌ Failed to delete chat:", err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* New Chat Button */}
      <button
        onClick={onNewChat}
        className="group relative w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 px-4 rounded-lg mb-6 font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
        <span>New Chat</span>
      </button>

      {/* Header */}
      <div className="flex items-center gap-2 mb-4 px-1">
        <MessageCircle className="w-5 h-5 text-blue-400" />
        <h2 className="text-lg text-white font-bold">Recent Chats</h2>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-3">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <p className="text-sm text-gray-400">Loading chats...</p>
          </div>
        ) : conversations?.length ? (
          <ul className="space-y-2">
            {conversations.map((chat: any, index: number) => (
              <li
                key={chat.chatId}
                className={`group relative flex justify-between items-center p-3 rounded-lg cursor-pointer transition-all duration-200 animate-fadeIn ${
                  activeChatId === chat.chatId
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md scale-[1.02]"
                    : "hover:bg-gray-800 text-gray-300 hover:text-white hover:shadow-md"
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => setActiveChatId(chat.chatId)}
              >
                {/* Chat Icon & Label */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                      activeChatId === chat.chatId
                        ? "bg-white/20"
                        : "bg-gray-700 group-hover:bg-gray-600"
                    }`}
                  >
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <span className="font-medium truncate">
                    Chat {chat.chatId.slice(-4)}
                  </span>
                </div>

                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(chat.chatId);
                  }}
                  className={`flex-shrink-0 ml-2 p-1.5 rounded-md transition-all duration-200 ${
                    activeChatId === chat.chatId
                      ? "hover:bg-white/20 text-white"
                      : "hover:bg-red-500/10 text-gray-400 hover:text-red-400"
                  } ${
                    deletingId === chat.chatId ? "opacity-50" : "opacity-0 group-hover:opacity-100"
                  }`}
                  disabled={deletingId === chat.chatId}
                >
                  {deletingId === chat.chatId ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>

                {/* Active Indicator */}
                {activeChatId === chat.chatId && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 space-y-3">
            <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-sm text-gray-500">No chats yet</p>
            <p className="text-xs text-gray-600">Start a new conversation</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }

        /* Custom Scrollbar */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(75, 85, 99, 0.5);
          border-radius: 3px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(75, 85, 99, 0.7);
        }
      `}</style>
    </div>
  );
}