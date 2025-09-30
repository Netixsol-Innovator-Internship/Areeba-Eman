"use client";

import { useRef, useEffect } from "react";

export default function ChatWindow({ messages }: { messages: any[] }) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div>
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((msg, idx) => (
        <div key={idx} className="mb-4">
          <p><strong>Q:</strong> {msg.question}</p>
          <p><strong>A:</strong> {msg.answer}</p>
        </div>
      ))}
      <div ref={endRef}></div>
    </div>
    </div>
  );
}
