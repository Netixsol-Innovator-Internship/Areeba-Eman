// components/Header.jsx
import { Wallet } from "lucide-react";

export default function Header({ account, connectedNetwork, onConnect }) {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200 w-full">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Areeba Token</h1>
            <p className="text-sm text-gray-500 mt-1">ARB Token Dashboard</p>
          </div>
          {!account ? (
            <button
              onClick={onConnect}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md"
            >
              <Wallet size={20} />
              Connect Wallet
            </button>
          ) : (
            <div className="text-right">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Connected
              </div>
              <p className="text-xs text-gray-800 font-mono bg-gray-100 px-3 py-1 rounded">
                {account.slice(0, 6)}...{account.slice(-4)}
              </p>
              <p className="text-xs text-gray-500 mt-1">{connectedNetwork}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}