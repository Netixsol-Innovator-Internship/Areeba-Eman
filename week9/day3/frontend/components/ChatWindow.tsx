"use client";
import { useAskQuestionMutation, useGetChatHistoryQuery } from "@/store/chatApi";
import { useEffect, useRef, useState } from "react";
import { Send, Loader2, Bot, User, Table2 } from "lucide-react";

interface Message {
  question: string;
  answer: string;
}

interface ChatWindowProps {
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export default function ChatWindow({
  activeChatId,
  setActiveChatId,
  messages,
  setMessages,
}: ChatWindowProps) {
  const [askQuestion, { isLoading: isSending }] = useAskQuestionMutation();
  const { data: chatHistory, isLoading: isLoadingHistory } = useGetChatHistoryQuery(
    activeChatId!,
    { skip: !activeChatId }
  );
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (chatHistory) {
      setMessages(chatHistory.messages || []);
    }
  }, [chatHistory, setMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  const handleSend = async (question: string) => {
    if (!question.trim() || isSending) return;

    setInputValue("");
    
    try {
      const res = await askQuestion({
        chatId: activeChatId || undefined,
        question,
      }).unwrap();

      if (res.chatId && !activeChatId) {
        setActiveChatId(res.chatId);
      }

      setMessages((prev: Message[]) => [
        ...prev,
        { question, answer: res.text || "No answer" },
      ]);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(inputValue);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-white">
      {/* Chat Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center shadow-md">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Cricket AI Assistant</h2>
            <p className="text-xs text-gray-500">
              {activeChatId ? `Chat ${activeChatId.slice(-6)}` : "New Conversation"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {isLoadingHistory ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-3">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
              <p className="text-sm text-gray-500">Loading chat history...</p>
            </div>
          </div>
        ) : messages.length === 0 && !isSending ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4 max-w-md">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center mx-auto">
                <Bot className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700">Start a Conversation</h3>
              <p className="text-sm text-gray-500">
                Ask me anything about cricket! Stats, players, matches, or trivia.
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => (
              <div key={idx} className="animate-fadeIn space-y-4">
                {/* User Question */}
                <div className="flex justify-end">
                  <div className="flex items-start gap-3 max-w-[80%]">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-md">
                      <p className="text-sm leading-relaxed break-words">{msg.question}</p>
                    </div>
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shadow-sm">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>

                {/* Bot Answer */}
                <div className="flex justify-start">
                  <div className="flex items-start gap-3 max-w-[85%]">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center shadow-sm">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                      {Array.isArray(msg.answer) ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                            <Table2 className="w-4 h-4" />
                            <span>Data Table</span>
                          </div>
                          <div className="overflow-x-auto rounded-lg border border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                <tr>
                                  {Object.keys(msg.answer[0] || {}).map((header) => (
                                    <th
                                      key={header}
                                      className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                                    >
                                      {header}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {msg.answer.map((row: Record<string, any>, i: number) => (
                                  <tr
                                    key={i}
                                    className="hover:bg-gray-50 transition-colors duration-150"
                                  >
                                    {Object.values(row).map((value, j) => (
                                      <td key={j} className="px-4 py-3 text-gray-800 whitespace-nowrap">
                                        {String(value)}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-800 leading-relaxed break-words">
                          {typeof msg.answer === "string"
                            ? msg.answer
                            : JSON.stringify(msg.answer)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isSending && (
              <div className="flex justify-start animate-fadeIn">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center shadow-sm">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="flex items-end gap-3 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              name="question"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Ask about cricket stats, players, matches..."
              disabled={isSending}
              className="w-full border-2 border-gray-200 focus:border-blue-500 rounded-2xl px-5 py-3 pr-12 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-50 disabled:text-gray-400"
            />
            {inputValue && (
              <button
                type="button"
                onClick={() => setInputValue("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={(e) => handleSubmit(e)}
            disabled={!inputValue.trim() || isSending}
            className="flex-shrink-0 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg transform hover:scale-105 active:scale-95"
          >
            {isSending ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Send className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }

        /* Custom Scrollbar */
        .overflow-y-auto::-webkit-scrollbar {
          width: 8px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(203, 213, 225, 0.6);
          border-radius: 4px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(203, 213, 225, 0.8);
        }
      `}</style>
    </div>
  );
}