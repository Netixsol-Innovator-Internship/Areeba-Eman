// components/Toast.jsx
export default function Toast({ message, type = "info" }) {
  const bgColor = type === "success" ? "bg-green-100 border-green-400 text-green-700" :
                  type === "error" ? "bg-red-100 border-red-400 text-red-700" :
                  "bg-blue-100 border-blue-400 text-blue-700";
  
  return (
    <div className={`border-l-4 p-4 rounded-r-lg ${bgColor} mb-4 shadow-md animate-slideIn`}>
      <p className="font-medium">{message}</p>
    </div>
  );
}