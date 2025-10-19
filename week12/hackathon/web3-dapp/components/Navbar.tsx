"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 bg-gray-900">
      <div className="flex gap-6">
        <Link href="/">🏠 Home</Link>
        <Link href="/faucet">💧 Faucet</Link>
        <Link href="/dex">💱 DEX</Link>
        <Link href="/marketplace">🖼️ Marketplace</Link>
        <Link href="/portfolio">📊 Portfolio</Link>
      </div>
      <ConnectButton />
    </nav>
  );
}
