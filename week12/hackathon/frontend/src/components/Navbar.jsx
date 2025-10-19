import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold">🌼 Daisy Marketplace</h1>
        <Link href="/faucet"><a className="text-sm text-gray-300 hover:text-white">Faucet</a></Link>
        <Link href="/dex"><a className="text-sm text-gray-300 hover:text-white">DEX</a></Link>
        <Link href="/marketplace"><a className="text-sm text-gray-300 hover:text-white">Marketplace</a></Link>
        <Link href="/portfolio"><a className="text-sm text-gray-300 hover:text-white">Portfolio</a></Link>
      </div>
      <ConnectButton showBalance={true} />
    </nav>
  );
}
