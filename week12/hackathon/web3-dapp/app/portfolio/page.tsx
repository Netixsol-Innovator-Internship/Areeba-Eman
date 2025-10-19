"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { writeContract, waitForTransactionReceipt, readContract } from "wagmi/actions";
import { PLATFORM_TOKEN_ABI, NFT_ABI, CONTRACTS } from "@/lib/constants";
import { wagmiConfig } from "@/lib/wagmiConfig";
import { parseEther, formatEther } from "viem";

const TOKENS = [
  { symbol: "PLT", address: CONTRACTS.PLT, name: "Platform Token", icon: "🪙" },
  { symbol: "ARB", address: CONTRACTS.ARB, name: "Arbitrum Token", icon: "🔷" },
  { symbol: "LU", address: CONTRACTS.LU, name: "Lunar Token", icon: "🌙" },
];

interface NFTData {
  tokenId: number;
  name: string;
  description: string;
  imageUrl: string;
}

interface ApprovalData {
  spender: string;
  amount: string;
}

export default function PortfolioPage() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<"overview" | "nfts" | "approvals" | "activities">("overview");

  // Balances
  const [balances, setBalances] = useState<Record<string, string>>({});
  const [totalValue, setTotalValue] = useState("0");

  // NFTs
  const [myNFTs, setMyNFTs] = useState<NFTData[]>([]);
  const [loadingNFTs, setLoadingNFTs] = useState(false);

  // Approvals
  const [selectedToken, setSelectedToken] = useState(TOKENS[0]);
  const [spenderAddress, setSpenderAddress] = useState("");
  const [approvalAmount, setApprovalAmount] = useState("");
  const [checkSpender, setCheckSpender] = useState("");
  const [allowanceResult, setAllowanceResult] = useState("");

  // Activities (mock data for now)
  const [activities, setActivities] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Convert IPFS URL to HTTP gateway
  const convertIPFSUrl = (url: string) => {
    if (url.startsWith('ipfs://')) {
      return url.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
    }
    return url;
  };

  // Fetch token balances
  const fetchBalances = async () => {
    if (!address) return;
    const newBalances: Record<string, string> = {};
    let total = 0;

    for (const token of TOKENS) {
      try {
        const balance = await readContract(wagmiConfig, {
          address: token.address as `0x${string}`,
          abi: PLATFORM_TOKEN_ABI,
          functionName: "balanceOf",
          args: [address],
        });
        const formattedBalance = formatEther(balance as bigint);
        newBalances[token.symbol] = formattedBalance;
        total += parseFloat(formattedBalance);
      } catch (err) {
        newBalances[token.symbol] = "0";
      }
    }

    setBalances(newBalances);
    setTotalValue(total.toFixed(2));
  };

  // Fetch NFT metadata
  const fetchNFTMetadata = async (tokenId: number) => {
    try {
      const tokenURI = await readContract(wagmiConfig, {
        address: CONTRACTS.NFT as `0x${string}`,
        abi: NFT_ABI,
        functionName: "tokenURI",
        args: [BigInt(tokenId)],
      });

      const httpUrl = convertIPFSUrl(tokenURI as string);
      const response = await fetch(httpUrl);
      const metadata = await response.json();

      return {
        tokenId,
        name: metadata.name || `Daisy #${tokenId}`,
        description: metadata.description || "",
        imageUrl: convertIPFSUrl(metadata.image) || `https://placehold.co/300x300/1a1a1a/white?text=Daisy+%23${tokenId}`,
      };
    } catch (err) {
      return {
        tokenId,
        name: `Daisy #${tokenId}`,
        description: "",
        imageUrl: `https://placehold.co/300x300/1a1a1a/white?text=Daisy+%23${tokenId}`,
      };
    }
  };

  // Fetch user's NFTs
  const fetchMyNFTs = async () => {
    if (!address) return;
    setLoadingNFTs(true);
    try {
      const nftList: NFTData[] = [];
      const totalMinted = await readContract(wagmiConfig, {
        address: CONTRACTS.NFT as `0x${string}`,
        abi: NFT_ABI,
        functionName: "totalMinted",
      });

      const totalMintedNum = Number(totalMinted);

      for (let i = 1; i <= Math.min(totalMintedNum, 100); i++) {
        try {
          const owner = await readContract(wagmiConfig, {
            address: CONTRACTS.NFT as `0x${string}`,
            abi: NFT_ABI,
            functionName: "ownerOf",
            args: [BigInt(i)],
          });

          if ((owner as string).toLowerCase() === address.toLowerCase()) {
            const metadata = await fetchNFTMetadata(i);
            nftList.push(metadata);
          }
        } catch (err) {
          // Token doesn't exist or not owned
        }
      }

      setMyNFTs(nftList);
    } catch (err) {
      console.error("Error fetching NFTs:", err);
    } finally {
      setLoadingNFTs(false);
    }
  };

  // Check allowance
  const handleCheckAllowance = async () => {
    if (!address || !checkSpender) return;
    setLoading(true);
    try {
      const allowance = await readContract(wagmiConfig, {
        address: selectedToken.address as `0x${string}`,
        abi: PLATFORM_TOKEN_ABI,
        functionName: "allowance",
        args: [address, checkSpender as `0x${string}`],
      });

      setAllowanceResult(formatEther(allowance as bigint));
      setMessage(`✅ Allowance: ${formatEther(allowance as bigint)} ${selectedToken.symbol}`);
    } catch (err: any) {
      console.error(err);
      setMessage(`❌ ${err.message || "Failed to check allowance"}`);
    } finally {
      setLoading(false);
    }
  };

  // Approve tokens
  const handleApprove = async () => {
    if (!address || !spenderAddress || !approvalAmount) return;
    setLoading(true);
    setMessage("");
    try {
      setMessage("Approving tokens...");
      const txHash = await writeContract(wagmiConfig, {
        address: selectedToken.address as `0x${string}`,
        abi: PLATFORM_TOKEN_ABI,
        functionName: "approve",
        args: [spenderAddress as `0x${string}`, parseEther(approvalAmount)],
        account: address,
      });

      setMessage("Waiting for confirmation...");
      await waitForTransactionReceipt(wagmiConfig, { hash: txHash });

      setMessage(`✅ Approved ${approvalAmount} ${selectedToken.symbol} to ${spenderAddress.slice(0, 6)}...${spenderAddress.slice(-4)}`);
      setSpenderAddress("");
      setApprovalAmount("");

      // Add to activities
      setActivities(prev => [{
        type: "approval",
        token: selectedToken.symbol,
        amount: approvalAmount,
        spender: spenderAddress,
        timestamp: new Date().toISOString(),
      }, ...prev]);
    } catch (err: any) {
      console.error(err);
      setMessage(`❌ ${err.message || "Approval failed"}`);
    } finally {
      setLoading(false);
    }
  };

  // Revoke approval (set to 0)
  const handleRevoke = async (tokenAddress: string, spender: string, tokenSymbol: string) => {
    if (!address) return;
    setLoading(true);
    setMessage("");
    try {
      setMessage("Revoking approval...");
      const txHash = await writeContract(wagmiConfig, {
        address: tokenAddress as `0x${string}`,
        abi: PLATFORM_TOKEN_ABI,
        functionName: "approve",
        args: [spender as `0x${string}`, BigInt(0)],
        account: address,
      });

      setMessage("Waiting for confirmation...");
      await waitForTransactionReceipt(wagmiConfig, { hash: txHash });

      setMessage(`✅ Revoked approval for ${tokenSymbol}`);
    } catch (err: any) {
      console.error(err);
      setMessage(`❌ ${err.message || "Revoke failed"}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && address) {
      fetchBalances();
      fetchMyNFTs();
    }
  }, [isConnected, address]);

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">📊 Portfolio</h2>
          <p className="text-gray-400">Connect your wallet to view your portfolio</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">📊 My Portfolio</h1>
        <p className="text-gray-400">{address?.slice(0, 6)}...{address?.slice(-4)}</p>
      </div>

      {/* Total Value Card */}
      <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-xl p-6 mb-8 border border-purple-800">
        <p className="text-gray-300 text-sm mb-2">Total Token Balance</p>
        <p className="text-5xl font-bold mb-4">{totalValue} Tokens</p>
        <div className="grid grid-cols-3 gap-4">
          {TOKENS.map((token) => (
            <div key={token.symbol} className="bg-black/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{token.icon}</span>
                <span className="font-semibold">{token.symbol}</span>
              </div>
              <p className="text-2xl font-bold">{parseFloat(balances[token.symbol] || "0").toFixed(4)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap ${
            activeTab === "overview" ? "bg-blue-600" : "bg-gray-800 hover:bg-gray-700"
          }`}
        >
          📈 Overview
        </button>
        <button
          onClick={() => setActiveTab("nfts")}
          className={`px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap ${
            activeTab === "nfts" ? "bg-blue-600" : "bg-gray-800 hover:bg-gray-700"
          }`}
        >
          🖼️ NFTs ({myNFTs.length})
        </button>
        <button
          onClick={() => setActiveTab("approvals")}
          className={`px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap ${
            activeTab === "approvals" ? "bg-blue-600" : "bg-gray-800 hover:bg-gray-700"
          }`}
        >
          ✅ Approvals
        </button>
        <button
          onClick={() => setActiveTab("activities")}
          className={`px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap ${
            activeTab === "activities" ? "bg-blue-600" : "bg-gray-800 hover:bg-gray-700"
          }`}
        >
          📜 Activities
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Token Balances */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h2 className="text-2xl font-bold mb-4">💰 Token Balances</h2>
            <div className="space-y-4">
              {TOKENS.map((token) => (
                <div key={token.symbol} className="flex justify-between items-center bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{token.icon}</span>
                    <div>
                      <p className="font-semibold">{token.name}</p>
                      <p className="text-sm text-gray-400">{token.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">{parseFloat(balances[token.symbol] || "0").toFixed(4)}</p>
                    <p className="text-sm text-gray-400">{token.symbol}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* NFT Summary */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h2 className="text-2xl font-bold mb-4">🖼️ NFT Collection</h2>
            <div className="bg-gray-800 rounded-lg p-6 text-center mb-4">
              <p className="text-5xl font-bold mb-2">{myNFTs.length}</p>
              <p className="text-gray-400">Total NFTs Owned</p>
            </div>
            {myNFTs.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {myNFTs.slice(0, 6).map((nft) => (
                  <img
                    key={nft.tokenId}
                    src={nft.imageUrl}
                    alt={nft.name}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}
            <button
              onClick={() => setActiveTab("nfts")}
              className="w-full mt-4 bg-purple-600 hover:bg-purple-700 py-2 rounded-lg transition"
            >
              View All NFTs
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h2 className="text-2xl font-bold mb-4">⚡ Quick Actions</h2>
            <div className="space-y-3">
              <a href="/faucet" className="block bg-green-600 hover:bg-green-700 py-3 rounded-lg text-center transition">
                🎁 Claim from Faucet
              </a>
              <a href="/dex" className="block bg-blue-600 hover:bg-blue-700 py-3 rounded-lg text-center transition">
                💱 Swap Tokens
              </a>
              <a href="/marketplace" className="block bg-purple-600 hover:bg-purple-700 py-3 rounded-lg text-center transition">
                🛒 Visit Marketplace
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h2 className="text-2xl font-bold mb-4">📊 Statistics</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Tokens</span>
                <span className="font-bold text-xl">{totalValue}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">NFTs Owned</span>
                <span className="font-bold text-xl">{myNFTs.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Recent Activities</span>
                <span className="font-bold text-xl">{activities.length}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NFTs Tab */}
      {activeTab === "nfts" && (
        <div>
          {loadingNFTs ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Loading NFTs...</p>
            </div>
          ) : myNFTs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg mb-4">You don't own any NFTs yet</p>
              <a href="/marketplace" className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg inline-block">
                Visit Marketplace
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {myNFTs.map((nft) => (
                <div key={nft.tokenId} className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden hover:border-purple-600 transition">
                  <img src={nft.imageUrl} alt={nft.name} className="w-full h-64 object-cover" />
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1">{nft.name}</h3>
                    {nft.description && (
                      <p className="text-sm text-gray-400 line-clamp-2">{nft.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Approvals Tab */}
      {activeTab === "approvals" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Approve Tokens */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h2 className="text-2xl font-bold mb-4">✅ Approve Tokens</h2>
            <p className="text-sm text-gray-400 mb-4">
              Allow another address to spend your tokens (useful for DEX, marketplace, etc.)
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Token</label>
                <select
                  value={selectedToken.symbol}
                  onChange={(e) => setSelectedToken(TOKENS.find(t => t.symbol === e.target.value)!)}
                  className="w-full bg-gray-800 px-4 py-3 rounded-lg"
                >
                  {TOKENS.map((token) => (
                    <option key={token.symbol} value={token.symbol}>
                      {token.icon} {token.symbol}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Spender Address</label>
                <input
                  type="text"
                  placeholder="0x..."
                  value={spenderAddress}
                  onChange={(e) => setSpenderAddress(e.target.value)}
                  className="w-full bg-gray-800 px-4 py-3 rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Amount</label>
                <input
                  type="number"
                  placeholder="0.0"
                  value={approvalAmount}
                  onChange={(e) => setApprovalAmount(e.target.value)}
                  className="w-full bg-gray-800 px-4 py-3 rounded-lg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Balance: {parseFloat(balances[selectedToken.symbol] || "0").toFixed(4)} {selectedToken.symbol}
                </p>
              </div>

              <button
                onClick={handleApprove}
                disabled={loading || !spenderAddress || !approvalAmount}
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  loading || !spenderAddress || !approvalAmount
                    ? "bg-gray-700 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {loading ? "Processing..." : "Approve"}
              </button>
            </div>
          </div>

          {/* Check Allowance */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h2 className="text-2xl font-bold mb-4">🔍 Check Allowance</h2>
            <p className="text-sm text-gray-400 mb-4">
              Check how much a spender is allowed to use from your tokens
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Token</label>
                <select
                  value={selectedToken.symbol}
                  onChange={(e) => setSelectedToken(TOKENS.find(t => t.symbol === e.target.value)!)}
                  className="w-full bg-gray-800 px-4 py-3 rounded-lg"
                >
                  {TOKENS.map((token) => (
                    <option key={token.symbol} value={token.symbol}>
                      {token.icon} {token.symbol}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Spender Address</label>
                <input
                  type="text"
                  placeholder="0x..."
                  value={checkSpender}
                  onChange={(e) => setCheckSpender(e.target.value)}
                  className="w-full bg-gray-800 px-4 py-3 rounded-lg"
                />
              </div>

              <button
                onClick={handleCheckAllowance}
                disabled={loading || !checkSpender}
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  loading || !checkSpender
                    ? "bg-gray-700 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                Check Allowance
              </button>

              {allowanceResult && (
                <div className="bg-gray-800 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-400 mb-1">Current Allowance</p>
                  <p className="text-2xl font-bold">{parseFloat(allowanceResult).toFixed(4)} {selectedToken.symbol}</p>
                  {parseFloat(allowanceResult) > 0 && (
                    <button
                      onClick={() => handleRevoke(selectedToken.address, checkSpender, selectedToken.symbol)}
                      disabled={loading}
                      className="mt-3 w-full bg-red-600 hover:bg-red-700 py-2 rounded-lg"
                    >
                      Revoke Approval
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Quick Addresses */}
            <div className="mt-6">
              <p className="text-sm text-gray-400 mb-2">Quick Addresses:</p>
              <div className="space-y-2">
                <button
                  onClick={() => setCheckSpender(CONTRACTS.DEX)}
                  className="w-full text-left bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded text-sm"
                >
                  DEX: {CONTRACTS.DEX.slice(0, 10)}...{CONTRACTS.DEX.slice(-8)}
                </button>
                <button
                  onClick={() => setCheckSpender(CONTRACTS.MARKETPLACE)}
                  className="w-full text-left bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded text-sm"
                >
                  Marketplace: {CONTRACTS.MARKETPLACE.slice(0, 10)}...{CONTRACTS.MARKETPLACE.slice(-8)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Activities Tab */}
      {activeTab === "activities" && (
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-2xl font-bold mb-4">📜 Recent Activities</h2>
          {activities.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No activities yet</p>
              <p className="text-sm text-gray-500 mt-2">Your approvals and transactions will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activities.map((activity, index) => (
                <div key={index} className="bg-gray-800 rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold">
                      {activity.type === "approval" && "✅ Token Approval"}
                    </p>
                    <p className="text-sm text-gray-400">
                      {activity.amount} {activity.token} to {activity.spender.slice(0, 6)}...{activity.spender.slice(-4)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Status Message */}
      {message && (
        <div className={`fixed bottom-6 right-6 p-4 rounded-lg shadow-lg max-w-md ${
          message.includes("✅") ? "bg-green-900" : message.includes("❌") ? "bg-red-900" : "bg-blue-900"
        }`}>
          {message}
        </div>
      )}
    </div>
  );
}