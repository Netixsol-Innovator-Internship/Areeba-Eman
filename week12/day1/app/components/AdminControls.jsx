// components/AdminControls.jsx
import { useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

export default function AdminControls({ 
  onMint, 
  onPause, 
  onUnpause, 
  onTransferOwnership, 
  onRenounce, 
  paused, 
  loading 
}) {
  const [mintTo, setMintTo] = useState("");
  const [mintAmount, setMintAmount] = useState("");
  const [newOwner, setNewOwner] = useState("");

  const handleMint = () => {
    onMint(mintTo, mintAmount);
    setMintTo("");
    setMintAmount("");
  };

  const handleTransferOwnership = () => {
    onTransferOwnership(newOwner);
    setNewOwner("");
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-lg border-2 border-purple-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <AlertCircle className="text-purple-600" size={24} />
        <h2 className="text-xl font-bold text-purple-900">Admin Controls</h2>
      </div>

      <div className="space-y-6">
        {/* Mint Section */}
        <div className="bg-white rounded-lg p-4 border border-purple-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Mint Tokens</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Recipient address"
              value={mintTo}
              onChange={(e) => setMintTo(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800 text-sm"
            />
            <input
              type="text"
              placeholder="Amount"
              value={mintAmount}
              onChange={(e) => setMintAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800 text-sm"
            />
            <button
              disabled={!mintTo || !mintAmount || loading}
              onClick={handleMint}
              className="w-full flex justify-center items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : "Mint"}
            </button>
          </div>
        </div>

        {/* Pause Controls */}
        <div className="bg-white rounded-lg p-4 border border-purple-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Contract State</h3>
          <div className="flex gap-3">
            <button
              disabled={paused || loading}
              onClick={onPause}
              className="flex-1 flex justify-center items-center gap-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : "Pause"}
            </button>
            <button
              disabled={!paused || loading}
              onClick={onUnpause}
              className="flex-1 flex justify-center items-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : "Unpause"}
            </button>
          </div>
        </div>

        {/* Ownership Controls */}
        <div className="bg-white rounded-lg p-4 border border-purple-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Ownership Management</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="New owner address"
              value={newOwner}
              onChange={(e) => setNewOwner(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800 text-sm"
            />
            <button
              disabled={!newOwner || loading}
              onClick={handleTransferOwnership}
              className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : "Transfer Ownership"}
            </button>
            <button
              disabled={loading}
              onClick={onRenounce}
              className="w-full flex justify-center items-center gap-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : "Renounce Ownership"}
            </button>
          </div>
        </div>

        </div>
    </div>
  );
}       