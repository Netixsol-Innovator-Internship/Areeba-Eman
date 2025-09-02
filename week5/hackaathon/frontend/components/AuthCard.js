export default function AuthCard({ title, children, footer }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>
        {children}
        {footer && <p className="mt-4 text-center text-sm text-gray-600">{footer}</p>}
      </div>
    </div>
  )
}
