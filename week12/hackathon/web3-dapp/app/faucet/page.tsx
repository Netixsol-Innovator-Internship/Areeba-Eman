"use client";

import { usePlatformToken } from "@/hooks/usePlatformToken";
import { useAccount } from "wagmi";
import { useState, useEffect } from "react";
import { waitForTransactionReceipt, writeContract, readContract } from "wagmi/actions";
import { FAUCET_ABI, CONTRACTS } from "@/lib/constants";
import { wagmiConfig } from "@/lib/wagmiConfig";

export default function FaucetPage() {
  const { address, isConnected } = useAccount();
  const { refetch, balance } = usePlatformToken();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [cooldown, setCooldown] = useState<number | null>(null);

  // 🔹 Fetch cooldown time from TokenFaucet contract
  const fetchCooldown = async () => {
    if (!address) return;
    try {
      const remaining = await readContract(wagmiConfig, {
        abi: FAUCET_ABI,
        address: CONTRACTS.FAUCET,
        functionName: "getTimeUntilNextClaim",
        args: [address],
      });
      setCooldown(Number(remaining));
    } catch (err) {
      console.error("Error fetching cooldown:", err);
    }
  };

  const handleClaim = async () => {
    if (!address) return;
    setLoading(true);
    setMessage(""); // Clear previous messages
    try {
      const txHash = await writeContract(wagmiConfig, {
        abi: FAUCET_ABI,
        address: CONTRACTS.FAUCET,
        functionName: "claimTokens",
        account: address,
      });

      setMessage("Transaction sent! Waiting for confirmation...");
      await waitForTransactionReceipt(wagmiConfig, { hash: txHash });

      await refetch();
      await fetchCooldown();

      setMessage("✅ Tokens claimed successfully!");
    } catch (err: any) {
      console.error(err);
      // Better error handling
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
    if (address) fetchCooldown();
  }, [address]);

  // Convert seconds → hours/minutes
  const formatCooldown = (seconds: number) => {
    if (seconds <= 0) return "✅ You can claim now!";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `⏳ ${hours}h ${minutes}m remaining`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-3xl font-bold mb-4">🎁 Token Faucet</h1>

      {isConnected ? (
        <>
          <p className="mb-2 text-gray-300">Your wallet: {address?.slice(0, 6)}...{address?.slice(-4)}</p>
          <p className="mb-2 text-xl">
            Balance:{" "}
            <span className="font-bold text-green-400">
              {balance ? (Number(balance) / 1e18).toFixed(2) : "Loading..."} PLT
            </span>
          </p>
          <p className="mb-4 text-sm text-gray-400">
            {cooldown !== null ? formatCooldown(cooldown) : "Checking cooldown..."}
          </p>

          <button
            onClick={handleClaim}
            disabled={loading || (cooldown !== null && cooldown > 0)}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              loading || (cooldown !== null && cooldown > 0)
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Claiming..." : "Claim 1000 PLT"}
          </button>

          {message && (
            <div className={`mt-4 p-3 rounded ${message.includes("✅") ? "bg-green-900/30" : "bg-red-900/30"}`}>
              {message}
            </div>
          )}
        </>
      ) : (
        <p className="text-gray-400">Connect your wallet to claim tokens.</p>
      )}
    </div>
  );
}