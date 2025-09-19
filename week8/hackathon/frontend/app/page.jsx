"use client";

import { useDispatch, useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { api } from "./lib/api";
import { addMessage, setPdfId, clearChat, setMetadata } from "./store/chatSlice";

export default function HomePage() {
  const dispatch = useDispatch();
  const { pdfId, messages } = useSelector((state) => state.chat);

  const [input, setInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);

  // 🔹 Ref for auto-scrolling
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/pdf/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Save PDF ID + metadata
      dispatch(setPdfId(res.data._id));
      dispatch(setMetadata({
        summary: res.data.summary,
        highlights: res.data.highlights,
        category: res.data.category
      }));

      // Show uploaded info as system/bot messages
      dispatch(addMessage({ role: "system", content: `📁 Uploaded: ${file.name}` }));
      dispatch(addMessage({
        role: "bot",
        content: 
          `**Executive Summary:** ${res.data.summary}\n\n` +
          `**Highlights:**\n- ${res.data.highlights.join("\n- ")}\n\n` +
          `**Category:** ${res.data.category}`
      }));
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    if (!pdfId) return alert("Please upload a PDF first.");

    const question = input;
    setInput("");
    dispatch(addMessage({ role: "user", content: question }));

    setSending(true);
    try {
      const res = await api.post(`/pdf/${pdfId}/ask`, { question });
      dispatch(addMessage({ role: "bot", content: res.data }));
    } catch (err) {
      console.error(err);
      alert("Failed to get answer");
    } finally {
      setSending(false);
    }
  };

  const handleNewChat = () => {
    dispatch(clearChat());
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="flex flex-col w-full max-w-2xl h-full border rounded-xl shadow-lg bg-white">
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-purple-500 text-white rounded-t-xl">
          <h1 className="text-2xl font-bold">📚 PDF Chatbot</h1>
          <button
            onClick={handleNewChat}
            className="px-4 py-2 bg-white text-purple-700 font-semibold rounded-lg hover:bg-purple-300 hover:text-white transition"
          >
            New Chat
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-xl px-4 py-2 rounded-2xl shadow break-words ${
                m.role === "user"
                  ? "bg-purple-400 text-white self-end ml-auto"
                  : "bg-gray-100 text-purple-800 self-start"
              }`}
            >
              {m.content.split("\n").map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex items-center gap-3 p-4 border-t bg-gray-100">
          <label className="cursor-pointer px-3 py-2 bg-purple-200 rounded-lg hover:bg-purple-300 transition text-gray-700 font-medium">
            📎 Upload
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            className="flex-1 px-4 py-2 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white text-gray-800"
          />

          <button
            onClick={handleSend}
            disabled={sending || uploading}
            className="px-5 py-2 bg-purple-500 text-white rounded-2xl hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
