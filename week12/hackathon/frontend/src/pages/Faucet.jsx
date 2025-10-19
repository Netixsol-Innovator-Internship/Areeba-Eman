"use client";
import { useState, useEffect } from "react";
import useContracts from "../hooks/useContracts";
import { useAccount } from "wagmi";
import { ethers } from "ethers";

export default function FaucetPage() {
  const { address } = useAccount();
  const { faucet, plt } = useContracts();
  const [cooldown, setCooldown] = useState(0);
  const [claimed, setClaimed] = useState(0);
  const [balance, setBalance] = useState("0");
  const [txStatus, setTxStatus] = useState("");

  useEffect(() => {
    if (!faucet || !address) return;
    let mounted = true;
    async function load() {
      try {
        const t = await faucet.getTimeUntilNextClaim(address);
        const c = await faucet.getTotalClaimed(address);
        if (mounted) {
          setCooldown(Number(t));
          setClaimed(Number(c));
        }
      } catch {}
      if (plt) {
        try {
          const b = await plt.balanceOf(address);
          setBalance(ethers.formatUnits(b, 18));
        } catch {}
      }
    }
    load();
    const iv = setInterval(load, 8000);
    return () => { mounted = false; clearInterval(iv); };
  }, [faucet, plt, address]);

  async function claim() {
    if (!faucet) return;
    setTxStatus("Waiting for tx...");
    try {
      const tx = await faucet.claimTokens();
      await tx.wait();
      setTxStatus("Claimed ✅");
    } catch (err) {
      setTxStatus("Failed: " + (err?.message || err));
    }
  }

  return (
    <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-xl">
      <h2 className="text-2xl font-bold mb-4">💧 Faucet</h2>
      <p>Address: <span className="font-mono text-sm">{address ?? "Connect wallet"}</span></p>
      <p className="mt-2">Your PLT Balance: <strong>{balance}</strong></p>
      <p>Total claimed: {claimed}</p>
      <div className="mt-4">
        <button
          onClick={claim}
          className="bg-blue-600 px-4 py-2 rounded-md disabled:opacity-50"
        >
          Claim tokens
        </button>
        <p className="mt-2 text-sm text-gray-300">{txStatus}</p>
      </div>
    </div>
  );
}
