export default function Button({ children, ...props }) {
  return (
    <button
      className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition"
      {...props}
    >
      {children}
    </button>
  )
}
