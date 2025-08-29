"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSocket } from "../lib/useSocket";
import ChatBubble from "components/ChatBubble";
import NotificationToast from "components/NotificationToast";

export default function CommentsPage() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [text, setText] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("username");
    if (!user) {
      router.push("/login");
      return;
    }
    setUsername(user);
  }, [router]);

  const { comments, notification, sendComment, deleteComment } = useSocket(username);

  const handleSend = () => {
    sendComment(text);
    setText("");
  };

  const logout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400">
      {/* Header */}
      <div className="bg-white/20 backdrop-blur-lg border-b border-white/20 shadow-lg">
        <div className="flex justify-between items-center p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl">💬</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Live Chat</h1>
              <p className="text-white/70 text-sm">Welcome back, {username}!</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Comments */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-white/60">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">💭</span>
            </div>
            <p className="text-lg font-medium">No messages yet</p>
            <p className="text-sm">Be the first to start the conversation!</p>
          </div>
        ) : (
          comments.map((c) => (
            <ChatBubble
              key={c.id}
              user={c.user}
              text={c.text}
              isMe={c.user === username}
              onDelete={c.user === username ? () => deleteComment(c.id) : undefined}
            />
          ))
        )}
      </div>

      {/* Input */}
      <div className="bg-white/20 backdrop-blur-lg border-t border-white/20 p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Type your message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!text.trim()}
            className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>

      {notification && <NotificationToast message={notification} />}
    </div>
  );
}
