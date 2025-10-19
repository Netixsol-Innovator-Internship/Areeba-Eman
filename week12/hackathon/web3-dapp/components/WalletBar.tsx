"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function WalletBar() {
  return (
    <div className="flex justify-between items-center bg-gray-900 px-6 py-3 border-b border-gray-700">
      <h1 className="text-xl font-bold">🌐 Web3 Suite</h1>
      <ConnectButton showBalance={false} />
    </div>
  );
}
