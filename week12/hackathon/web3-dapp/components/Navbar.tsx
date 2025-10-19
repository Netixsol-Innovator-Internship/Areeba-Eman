"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 bg-gray-900">
      <div className="flex gap-6">
        <Link href="/" className="hover:text-gray-300 hover:font-bold">🏠 Home</Link>
        <Link href="/faucet" className="hover:text-gray-300 hover:font-bold">💧 Faucet</Link>
        <Link href="/dex" className="hover:text-gray-300 hover:font-bold">💱 DEX</Link>
        <Link href="/marketplace" className="hover:text-gray-300 hover:font-bold">🖼️ Marketplace</Link>
        <Link href="/portfolio" className="hover:text-gray-300 hover:font-bold">📊 Portfolio</Link>
      </div>
      <ConnectButton />
    </nav>
  );
}
