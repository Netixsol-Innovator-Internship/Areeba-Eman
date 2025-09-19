"use client";

import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { api } from "./lib/api";
import { addMessage, setPdfId, clearChat, setMetadata } from "./store/chatSlice";

export default function HomePage() {
  const dispatch = useDispatch();
  const { pdfId, messages } = useSelector((state) => state.chat);

  const [input, setInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);

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

    // ✅ Save PDF ID + metadata
    dispatch(setPdfId(res.data._id));
    dispatch(setMetadata({
      summary: res.data.summary,
      highlights: res.data.highlights,
      category: res.data.category
    }));

    // ✅ Show it as system/bot messages
    dispatch(addMessage({
      role: "system",
      content: `📁 Uploaded: ${file.name}`
    }));
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
    <div className="flex mx-24 flex-col h-screen text-black">
      {/* Header */}
      <div className="p-4 border-b flex justify-between text-white items-center">
        <h1 className="text-xl font-bold">📚 PDF Chatbot</h1>
        <button
          onClick={handleNewChat}
          className="px-3 py-1 bg-gray-200 text-black rounded hover:bg-gray-300"
        >
          New Chat
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg max-w-xl ${
              m.role === "user"
                ? "bg-blue-100 self-end ml-auto"
                : m.role === "bot"
                ? "bg-gray-100"
                : "bg-green-100 text-sm"
            }`}
          >
            {m.content}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t flex items-center gap-2">
        <label className="cursor-pointer px-3 py-2 bg-gray-200 rounded hover:bg-gray-300">
          📎
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
          className="flex-1 border rounded px-3 py-2 text-white"
        />

        <button
          onClick={handleSend}
          disabled={sending || uploading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {sending ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
