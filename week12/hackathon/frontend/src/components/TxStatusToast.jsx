export default function TxStatusToast({ message, type }) {
  const color =
    type === "success" ? "bg-green-600" : type === "error" ? "bg-red-600" : "bg-gray-600";
  return (
    <div className={`${color} text-white px-4 py-2 rounded-lg fixed bottom-5 right-5 shadow-xl`}>
      {message}
    </div>
  );
}
