// components/ApproveSection.jsx
import { useState } from "react";

export default function ApproveSection({ onApprove, onCheckAllowance, loading }) {
  const [spender, setSpender] = useState("");
  const [amount, setAmount] = useState("");
  const [allowanceOwner, setAllowanceOwner] = useState("");
  const [allowanceValue, setAllowanceValue] = useState("");

  const handleApprove = () => {
    onApprove(spender, amount);
  };

  const handleCheckAllowance = async () => {
    const value = await onCheckAllowance(allowanceOwner, spender);
    setAllowanceValue(value);
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Approve & Allowance</h2>
      
      <div className="space-y-4 mb-6">
        <h3 className="text-sm font-semibold text-gray-700">Approve Spender</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Spender Address
          </label>
          <input
            type="text"
            placeholder="0x..."
            value={spender}
            onChange={(e) => setSpender(e.target.value)}
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
          disabled={!spender || !amount || loading}
          onClick={handleApprove}
          className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Approve
        </button>
      </div>

      <div className="border-t border-gray-200 pt-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-700">Check Allowance</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Owner Address
          </label>
          <input
            type="text"
            placeholder="0x..."
            value={allowanceOwner}
            onChange={(e) => setAllowanceOwner(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800"
          />
        </div>
        <button
          disabled={!allowanceOwner || !spender || loading}
          onClick={handleCheckAllowance}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Check Allowance
        </button>
        {allowanceValue && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Allowance:</span> {allowanceValue} ARB
            </p>
          </div>
        )}
      </div>
    </div>
  );
}