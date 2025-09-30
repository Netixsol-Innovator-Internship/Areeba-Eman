'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle, Minus, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Sender = 'user' | 'ai';
export interface ChatProduct {
  name: string;
  price?: number | string;
  brand?: string;
}

type ChatMessage = {
  id: string;
  sender: Sender;
  text: string;
  products?: ChatProduct;
};

type ChatResponse = {
  chatId?: string;
  reply?: string;
  explanationai?: string;
  products?: ChatProduct;
  history?: unknown[];
};

function genId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function ChatWidget() {
  const token = useSelector((s: RootState) => s.auth.token);
  const [isOpen, setIsOpen] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });

     const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.lang = "en-US"; // or "ur-PK"
      recog.interimResults = false;

      recog.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setListening(false);
      };

      recog.onerror = () => setListening(false);

      setRecognition(recog);
    }
  }, []);


  async function postJSON(path: string, body: Record<string, unknown>) {
    const res = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await res.text());
    return (await res.json()) as ChatResponse;
  }

  // 🔊 Speak function (auto-stop before new speech)
const speak = (text: string) => {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesis.speak(utterance);
  }
};

function stopSpeaking() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }
}

const handleSend = async (e?: React.FormEvent) => {
  e?.preventDefault();
  const trimmed = input.trim();
  if (!trimmed) return;

  const userMsg: ChatMessage = { id: genId(), sender: 'user', text: trimmed };
  setMessages((m) => [...m, userMsg]);
  setInput('');
  setLoading(true);

  try {
    const payload: Record<string, unknown> = { message: trimmed };
    if (chatId) payload.chatId = chatId;
    const resp = await postJSON('/chat', payload);

    if (resp.chatId) setChatId(String(resp.chatId));

    const aiText = resp.reply || resp.explanationai || 'No response';
    const aiMsg: ChatMessage = { id: genId(), sender: 'ai', text: aiText };

    if (resp.products && Array.isArray(resp.products)) {
      aiMsg.products = resp.products;
    }

    setMessages((m) => [...m, aiMsg]);

    // ✅ Speak AI response here
    if (ttsEnabled) {
      speak(aiText);
    }

  } catch (err: unknown) {
    setMessages((m) => [
      ...m,
      { id: genId(), sender: 'ai', text: `⚠️ Error: ${String(err)}` },
    ]);
  } finally {
    setLoading(false);
  }
};


  const handleReset = async () => {
    if (chatId) {
      try {
        await postJSON('/chat/reset', { chatId });
      } catch {}
    }
    setChatId(null);
    setMessages([]);
    setInput('');
    setIsOpen(false); // also close
  };

  return (
    <>
      {/* Floating Icon */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 z-50 bg-green-600 text-white p-4 rounded-full shadow-xl hover:bg-green-700 transition"
        >
          <MessageCircle size={22} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 left-6 z-50 w-80 h-[500px] rounded-2xl shadow-2xl border border-green-200 bg-white flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
            <div className="flex items-center gap-2">
              <MessageCircle size={18} />
              <span className="font-semibold">Healthcare AI Assistant</span>
            </div>
            <div className="flex items-center gap-2">
              {/* Minimize */}
              <button
              onClick={() => {
                if (isSpeaking) {
                  stopSpeaking(); // ⏹️ stop mid-sentence
                } else {
                  setTtsEnabled((prev) => !prev); // toggle TTS
                }
              }}
              className={`p-1 rounded ${
                isSpeaking ? "bg-red-500" : ttsEnabled ? "bg-yellow-400" : "bg-gray-300"
              }`}
              title={
                isSpeaking
                  ? "Click to stop speaking"
                  : ttsEnabled
                  ? "TTS On - Click to turn off"
                  : "TTS Off - Click to enable"
              }
            >
              🔊
            </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-green-700 rounded"
              >
                <Minus size={16} />
              </button>
              {/* Reset / Close */}
              <button
                onClick={handleReset}
                className="p-1 hover:bg-red-600 rounded"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-green-50 to-white">
            {messages.length === 0 && (
              <div className="text-gray-400 text-sm text-center">
                💬 Ask about healthcare products, symptoms, or suggestions.
              </div>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${
                  m.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl shadow-sm whitespace-pre-line text-sm ${
                    m.sender === 'user'
                      ? 'bg-green-600 text-white rounded-br-sm'
                      : 'bg-white border border-green-200 text-gray-800 rounded-bl-sm'
                  }`}
                >
                  {m.text}
                  {m.products && Array.isArray(m.products) && (
                    <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-2">
                      <div className="text-xs text-green-700 font-semibold mb-2">
                        🌿 Suggested Products
                      </div>
                      <ul className="space-y-1 text-sm">
                        {m.products.map((p: any, idx: number) => (
                          <li
                            key={idx}
                            className="flex justify-between items-center bg-white rounded-md p-2 shadow-sm border hover:shadow-md transition"
                          >
                            <span>
                              {p?.name}{' '}
                              {p?.brand && (
                                <span className="text-gray-500">· {p.brand}</span>
                              )}
                            </span>
                            <span className="font-bold text-green-700">
                              {p?.price ? `$${p.price}` : ''}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            className="flex items-center gap-2 p-3 border-t bg-white"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-2 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Type your message or speak something..."
            />
              {/* 🎤 Microphone Button */}
            <button
              type="button"
              onClick={() => {
                if (!recognition) {
                  alert("Your browser does not support speech recognition.");
                  return;
                }
                if (listening) {
                  recognition.stop();
                  setListening(false);
                } else {
                  recognition.start();
                  setListening(true);
                }
              }}
              className={`px-2 py-1 rounded-full text-white ${
                listening ? "bg-red-500" : "bg-blue-500"
              }`}
            >
              {listening ? "🎙️" : "🎤"}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded-full transition disabled:opacity-50"
            >
              {loading ? '...' : 'Send'}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
