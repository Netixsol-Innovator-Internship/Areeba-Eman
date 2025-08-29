interface NotificationToastProps {
  message: string
}

export default function NotificationToast({ message }: NotificationToastProps) {
  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl shadow-lg max-w-sm">
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  )
}
