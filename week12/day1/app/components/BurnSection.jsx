// components/BurnSection.jsx
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function BurnSection({ onBurn, loading }) {
  const [amount, setAmount] = useState("");

  const handleBurn = () => {
    onBurn(amount);
    setAmount("");
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-red-200 p-6">
      <h2 className="text-xl font-bold text-red-700 mb-4">Burn Tokens</h2>
      <p className="text-sm text-gray-600 mb-4">
        Permanently remove tokens from circulation by burning them from your balance.
      </p>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount to Burn
          </label>
          <input
            type="text"
            placeholder="0.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-800"
          />
        </div>
        <button
          disabled={!amount || loading}
          onClick={handleBurn}
          className="w-full flex justify-center items-center gap-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : "Burn Tokens"}
        </button>
      </div>
    </div>
  );
}