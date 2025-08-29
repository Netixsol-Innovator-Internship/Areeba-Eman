"use client"

interface ChatBubbleProps {
  user: string
  text: string
  isMe: boolean
  onDelete?: () => void
}

export default function ChatBubble({ user, text, isMe, onDelete }: ChatBubbleProps) {
  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-lg ${
          isMe
            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            : "bg-white text-gray-800 border border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between mb-1">
          <span className={`text-xs font-semibold ${isMe ? "text-purple-100" : "text-purple-600"}`}>{user}</span>
          {onDelete && (
            <button onClick={onDelete} className="text-xs opacity-70 hover:opacity-100 ml-2">
              ✕
            </button>
          )}
        </div>
        <p className="text-sm leading-relaxed">{text}</p>
      </div>
    </div>
  )
}
