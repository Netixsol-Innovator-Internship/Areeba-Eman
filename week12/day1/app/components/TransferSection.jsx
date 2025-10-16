// components/TransferSection.jsx
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function TransferSection({ onTransfer, loading }) {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = () => {
    onTransfer(to, amount);
    setTo("");
    setAmount("");
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Transfer Tokens</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recipient Address
          </label>
          <input
            type="text"
            placeholder="0x..."
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount
          </label>
          <input
            type="text"
            placeholder="0.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800"
          />
        </div>
        <button
          disabled={!to || !amount || loading}
          onClick={handleSubmit}
          className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : "Send Tokens"}
        </button>
      </div>
    </div>
  );
}