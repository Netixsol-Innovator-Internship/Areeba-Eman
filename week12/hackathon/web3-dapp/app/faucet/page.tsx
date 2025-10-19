"use client";

import { usePlatformToken } from "@/hooks/usePlatformToken";
import { useAccount } from "wagmi";
import { useState, useEffect } from "react";
import { waitForTransactionReceipt, writeContract, readContract } from "wagmi/actions";
import { FAUCET_ABI, CONTRACTS } from "@/lib/constants";
import { wagmiConfig } from "@/lib/wagmiConfig";

interface ClaimHistory {
  amount: string;
  timestamp: string;
  txHash: string;
}

export default function FaucetPage() {
  const { address, isConnected } = useAccount();
  const { refetch, balance } = usePlatformToken();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [cooldown, setCooldown] = useState<number | null>(null);
  const [totalClaimed, setTotalClaimed] = useState("0");
  const [claimHistory, setClaimHistory] = useState<ClaimHistory[]>([]);

  // Fetch cooldown time from TokenFaucet contract
  const fetchCooldown = async () => {
    if (!address) return;
    try {
      const remaining = await readContract(wagmiConfig, {
        abi: FAUCET_ABI,
        address: CONTRACTS.FAUCET as `0x${string}`,
        functionName: "getTimeUntilNextClaim",
        args: [address],
      });
      setCooldown(Number(remaining));
    } catch (err) {
      console.error("Error fetching cooldown:", err);
    }
  };

  // Fetch total claimed tokens
  const fetchTotalClaimed = async () => {
    if (!address) return;
    try {
      const total = await readContract(wagmiConfig, {
        abi: FAUCET_ABI,
        address: CONTRACTS.FAUCET as `0x${string}`,
        functionName: "getTotalClaimed",
        args: [address],
      });
      setTotalClaimed((Number(total) / 1e18).toFixed(2));
    } catch (err) {
      console.error("Error fetching total claimed:", err);
    }
  };

  // Load claim history from localStorage
  const loadClaimHistory = () => {
    if (!address) return;
    const storageKey = `faucet-history-${address}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      setClaimHistory(JSON.parse(stored));
    }
  };

  // Save claim to history
  const saveClaimToHistory = (txHash: string, amount: string) => {
    if (!address) return;
    const newClaim: ClaimHistory = {
      amount,
      timestamp: new Date().toISOString(),
      txHash,
    };
    const storageKey = `faucet-history-${address}`;
    const updated = [newClaim, ...claimHistory].slice(0, 10); // Keep last 10
    setClaimHistory(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const handleClaim = async () => {
    if (!address) return;
    setLoading(true);
    setMessage("");
    try {
      const txHash = await writeContract(wagmiConfig, {
        abi: FAUCET_ABI,
        address: CONTRACTS.FAUCET as `0x${string}`,
        functionName: "claimTokens",
        account: address,
      });

      setMessage("Transaction sent! Waiting for confirmation...");
      await waitForTransactionReceipt(wagmiConfig, { hash: txHash });

      // Save to history
      saveClaimToHistory(txHash, "1000");

      await refetch();
      await fetchCooldown();
      await fetchTotalClaimed();

      setMessage("✅ Tokens claimed successfully!");
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("wait 24h")) {
        setMessage("❌ You must wait 24 hours between claims");
      } else if (err.message?.includes("Faucet empty")) {
        setMessage("❌ Faucet is empty. Contact admin.");
      } else {
        setMessage("❌ Transaction failed. Check console for details.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (address) {
      fetchCooldown();
      fetchTotalClaimed();
      loadClaimHistory();
    }
  }, [address]);

  // Auto-update cooldown timer every second
  useEffect(() => {
    if (cooldown !== null && cooldown > 0) {
      const interval = setInterval(() => {
        setCooldown(prev => (prev !== null && prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [cooldown]);

  // Format cooldown with seconds
  const formatCooldown = (seconds: number) => {
    if (seconds <= 0) return "✅ You can claim now!";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `⏳ ${hours}h ${minutes}m ${secs}s remaining`;
  };

  // Format timestamp
  const formatTimestamp = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">🎁 Token Faucet</h1>
        <p className="text-gray-400">Claim free PLT tokens every 24 hours</p>
      </div>

      {isConnected ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Claim Card */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-6">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">💰</div>
                <p className="text-gray-400 mb-2">Your Wallet</p>
                <p className="text-sm text-gray-500 font-mono mb-4">
                  {address?.slice(0, 10)}...{address?.slice(-8)}
                </p>
                
                <div className="bg-gray-800 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-400 mb-1">Current Balance</p>
                  <p className="text-3xl font-bold text-green-400">
                    {balance ? (Number(balance) / 1e18).toFixed(2) : "Loading..."} PLT
                  </p>
                </div>

                <div className="bg-purple-900/30 border border-purple-800 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-2">Next Claim Available</p>
                  <p className="text-xl font-bold">
                    {cooldown !== null ? formatCooldown(cooldown) : "Checking..."}
                  </p>
                </div>
              </div>

              <button
                onClick={handleClaim}
                disabled={loading || (cooldown !== null && cooldown > 0)}
                className={`w-full py-4 rounded-lg font-semibold text-lg transition ${
                  loading || (cooldown !== null && cooldown > 0)
                    ? "bg-gray-700 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? "Claiming..." : "Claim 1,000 PLT"}
              </button>

              {message && (
                <div className={`mt-4 p-4 rounded-lg text-center ${
                  message.includes("✅") ? "bg-green-900/30 border border-green-800" : "bg-red-900/30 border border-red-800"
                }`}>
                  {message}
                </div>
              )}
            </div>

            {/* Claim History */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4">📜 Claim History</h2>
              {claimHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p>No claims yet</p>
                  <p className="text-sm mt-2">Your claim history will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {claimHistory.map((claim, index) => (
                    <div key={index} className="bg-gray-800 rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-green-400">+{claim.amount} PLT</p>
                        <p className="text-sm text-gray-400">{formatTimestamp(claim.timestamp)}</p>
                      </div>
                      <a
                        href={`https://sepolia.etherscan.io/tx/${claim.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        View Tx →
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            {/* Total Claimed */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-2">Total Claimed</p>
                <p className="text-4xl font-bold text-purple-400 mb-2">{totalClaimed}</p>
                <p className="text-gray-500 text-sm">PLT Tokens</p>
              </div>
            </div>

            {/* Faucet Info */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="font-bold mb-3">ℹ️ How It Works</h3>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex gap-2">
                  <span>•</span>
                  <p>Claim 1,000 PLT tokens for free</p>
                </div>
                <div className="flex gap-2">
                  <span>•</span>
                  <p>Wait 24 hours between claims</p>
                </div>
                <div className="flex gap-2">
                  <span>•</span>
                  <p>Use tokens for swapping and buying NFTs</p>
                </div>
                <div className="flex gap-2">
                  <span>•</span>
                  <p>No registration required</p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="font-bold mb-3">🚀 Quick Actions</h3>
              <div className="space-y-2">
                <a
                  href="/dex"
                  className="block bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-lg text-center transition"
                >
                  Swap Tokens
                </a>
                <a
                  href="/marketplace"
                  className="block bg-purple-600 hover:bg-purple-700 py-2 px-4 rounded-lg text-center transition"
                >
                  Buy NFTs
                </a>
                <a
                  href="/portfolio"
                  className="block bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded-lg text-center transition"
                >
                  View Portfolio
                </a>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="font-bold mb-3">📊 Your Stats</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Claims</span>
                  <span className="font-bold">{claimHistory.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Last Claim</span>
                  <span className="font-bold">
                    {claimHistory.length > 0
                      ? new Date(claimHistory[0].timestamp).toLocaleDateString()
                      : "Never"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔒</div>
          <p className="text-gray-400 text-lg">Connect your wallet to claim tokens</p>
        </div>
      )}
    </div>
  );
}