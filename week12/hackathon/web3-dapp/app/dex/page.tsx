"use client";

import { useState, useEffect } from "react";
import { useAccount, useReadContract } from "wagmi";
import { writeContract, waitForTransactionReceipt, readContract } from "wagmi/actions";
import { DEX_ABI, PLATFORM_TOKEN_ABI, CONTRACTS } from "@/lib/constants";
import { wagmiConfig } from "@/lib/wagmiConfig";
import { parseEther, formatEther } from "viem";

const TOKENS = [
  { symbol: "PLT", address: CONTRACTS.PLT, name: "Platform Token" },
  { symbol: "ARB", address: CONTRACTS.ARB, name: "Arbitrum Token" },
  { symbol: "LU", address: CONTRACTS.LU, name: "Lunar Token" },
];

export default function DEXPage() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<"swap" | "liquidity">("swap");

  // Swap State
  const [fromToken, setFromToken] = useState(TOKENS[0]);
  const [toToken, setToToken] = useState(TOKENS[1]);
  const [swapAmount, setSwapAmount] = useState("");
  const [expectedOutput, setExpectedOutput] = useState("0");
  const [slippage, setSlippage] = useState("0.5");

  // Liquidity State
  const [liquidityTokenA, setLiquidityTokenA] = useState(TOKENS[0]);
  const [liquidityTokenB, setLiquidityTokenB] = useState(TOKENS[1]);
  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");
  const [userContribution, setUserContribution] = useState({ a: "0", b: "0" });

  // Pool Reserves
  const [reserves, setReserves] = useState({ reserveA: "0", reserveB: "0" });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Token Balances
  const [balances, setBalances] = useState<Record<string, string>>({});

  // Fetch token balances
  const fetchBalances = async () => {
    if (!address) return;
    const newBalances: Record<string, string> = {};
    
    for (const token of TOKENS) {
      try {
        const balance = await readContract(wagmiConfig, {
          address: token.address as `0x${string}`,
          abi: PLATFORM_TOKEN_ABI,
          functionName: "balanceOf",
          args: [address],
        });
        newBalances[token.symbol] = formatEther(balance as bigint);
      } catch (err) {
        newBalances[token.symbol] = "0";
      }
    }
    setBalances(newBalances);
  };

  // Fetch pool reserves
  const fetchReserves = async (tokenA: typeof TOKENS[0], tokenB: typeof TOKENS[0]) => {
    try {
      const result = await readContract(wagmiConfig, {
        address: CONTRACTS.DEX as `0x${string}`,
        abi: DEX_ABI,
        functionName: "getReserves",
        args: [tokenA.address, tokenB.address],
      });
      const [resA, resB] = result as [bigint, bigint];
      setReserves({
        reserveA: formatEther(resA),
        reserveB: formatEther(resB),
      });
    } catch (err) {
      setReserves({ reserveA: "0", reserveB: "0" });
    }
  };

  // Fetch user contributions
  const fetchUserContribution = async (tokenA: typeof TOKENS[0], tokenB: typeof TOKENS[0]) => {
    if (!address) return;
    try {
      const result = await readContract(wagmiConfig, {
        address: CONTRACTS.DEX as `0x${string}`,
        abi: DEX_ABI,
        functionName: "getUserContribution",
        args: [tokenA.address, tokenB.address, address],
      });
      const [contribA, contribB] = result as [bigint, bigint];
      setUserContribution({
        a: formatEther(contribA),
        b: formatEther(contribB),
      });
    } catch (err) {
      setUserContribution({ a: "0", b: "0" });
    }
  };

  // Preview swap output
  const previewSwap = async () => {
    if (!swapAmount || parseFloat(swapAmount) <= 0) {
      setExpectedOutput("0");
      return;
    }
    try {
      const result = await readContract(wagmiConfig, {
        address: CONTRACTS.DEX as `0x${string}`,
        abi: DEX_ABI,
        functionName: "previewSwap",
        args: [fromToken.address, toToken.address, parseEther(swapAmount)],
      });
      setExpectedOutput(formatEther(result as bigint));
    } catch (err) {
      setExpectedOutput("0");
    }
  };

  useEffect(() => {
    if (isConnected) {
      fetchBalances();
      fetchReserves(fromToken, toToken);
    }
  }, [isConnected, address]);

  useEffect(() => {
    if (activeTab === "swap") {
      fetchReserves(fromToken, toToken);
      if (swapAmount) previewSwap();
    } else {
      fetchReserves(liquidityTokenA, liquidityTokenB);
      fetchUserContribution(liquidityTokenA, liquidityTokenB);
    }
  }, [activeTab, fromToken, toToken, liquidityTokenA, liquidityTokenB, swapAmount]);

  // Approve token
  const approveToken = async (tokenAddress: string, amount: string) => {
    const txHash = await writeContract(wagmiConfig, {
      address: tokenAddress as `0x${string}`,
      abi: PLATFORM_TOKEN_ABI,
      functionName: "approve",
      args: [CONTRACTS.DEX, parseEther(amount)],
      account: address,
    });
    await waitForTransactionReceipt(wagmiConfig, { hash: txHash });
  };

  // Swap tokens
  const handleSwap = async () => {
    if (!address || !swapAmount || parseFloat(swapAmount) <= 0) return;
    setLoading(true);
    setMessage("");
    try {
      setMessage("Approving token...");
      await approveToken(fromToken.address, swapAmount);

      const minOutput = (parseFloat(expectedOutput) * (1 - parseFloat(slippage) / 100)).toFixed(18);
      
      setMessage("Executing swap...");
      const txHash = await writeContract(wagmiConfig, {
        address: CONTRACTS.DEX as `0x${string}`,
        abi: DEX_ABI,
        functionName: "swap",
        args: [
          fromToken.address,
          toToken.address,
          parseEther(swapAmount),
          parseEther(minOutput),
        ],
        account: address,
      });

      setMessage("Waiting for confirmation...");
      await waitForTransactionReceipt(wagmiConfig, { hash: txHash });

      setMessage("✅ Swap successful!");
      setSwapAmount("");
      setExpectedOutput("0");
      fetchBalances();
      fetchReserves(fromToken, toToken);
    } catch (err: any) {
      console.error(err);
      setMessage(`❌ ${err.message || "Swap failed"}`);
    } finally {
      setLoading(false);
    }
  };

  // Add liquidity
  const handleAddLiquidity = async () => {
    if (!address || !amountA || !amountB) return;
    setLoading(true);
    setMessage("");
    try {
      setMessage("Approving tokens...");
      await approveToken(liquidityTokenA.address, amountA);
      await approveToken(liquidityTokenB.address, amountB);

      setMessage("Adding liquidity...");
      const txHash = await writeContract(wagmiConfig, {
        address: CONTRACTS.DEX as `0x${string}`,
        abi: DEX_ABI,
        functionName: "addLiquidity",
        args: [
          liquidityTokenA.address,
          liquidityTokenB.address,
          parseEther(amountA),
          parseEther(amountB),
        ],
        account: address,
      });

      setMessage("Waiting for confirmation...");
      await waitForTransactionReceipt(wagmiConfig, { hash: txHash });

      setMessage("✅ Liquidity added successfully!");
      setAmountA("");
      setAmountB("");
      fetchBalances();
      fetchReserves(liquidityTokenA, liquidityTokenB);
      fetchUserContribution(liquidityTokenA, liquidityTokenB);
    } catch (err: any) {
      console.error(err);
      setMessage(`❌ ${err.message || "Failed to add liquidity"}`);
    } finally {
      setLoading(false);
    }
  };

  // Remove liquidity
  const handleRemoveLiquidity = async (percentage: number) => {
    if (!address) return;
    setLoading(true);
    setMessage("");
    try {
      setMessage("Removing liquidity...");
      const txHash = await writeContract(wagmiConfig, {
        address: CONTRACTS.DEX as `0x${string}`,
        abi: DEX_ABI,
        functionName: "removeLiquidity",
        args: [
          liquidityTokenA.address,
          liquidityTokenB.address,
          BigInt(percentage * 100),
        ],
        account: address,
      });

      setMessage("Waiting for confirmation...");
      await waitForTransactionReceipt(wagmiConfig, { hash: txHash });

      setMessage("✅ Liquidity removed successfully!");
      fetchBalances();
      fetchReserves(liquidityTokenA, liquidityTokenB);
      fetchUserContribution(liquidityTokenA, liquidityTokenB);
    } catch (err: any) {
      console.error(err);
      setMessage(`❌ ${err.message || "Failed to remove liquidity"}`);
    } finally {
      setLoading(false);
    }
  };

  const switchTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setSwapAmount("");
    setExpectedOutput("0");
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">💱 Multi-Token DEX</h2>
          <p className="text-gray-400">Connect your wallet to start trading</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">💱 Multi-Token DEX</h1>
        <p className="text-gray-400">Swap tokens and provide liquidity</p>
      </div>

      {/* Balances Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {TOKENS.map((token) => (
          <div key={token.symbol} className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{token.name}</p>
                <p className="text-2xl font-bold">{parseFloat(balances[token.symbol] || "0").toFixed(4)}</p>
              </div>
              <div className="text-3xl">{token.symbol === "PLT" ? "💵" : token.symbol === "ARB" ? "🔷" : "🌙"}</div>
            </div>
            <p className="text-xs text-gray-500 mt-2">{token.symbol}</p>
          </div>
        ))}
      </div>

      {/* Main Card */}
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("swap")}
            className={`flex-1 py-3 rounded-lg font-semibold transition ${
              activeTab === "swap" ? "bg-blue-600" : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            Swap
          </button>
          <button
            onClick={() => setActiveTab("liquidity")}
            className={`flex-1 py-3 rounded-lg font-semibold transition ${
              activeTab === "liquidity" ? "bg-blue-600" : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            Liquidity
          </button>
        </div>

        {/* Swap Tab */}
        {activeTab === "swap" && (
          <div>
            {/* From Token */}
            <div className="bg-gray-800 rounded-lg p-4 mb-2">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-400">From</span>
                <span className="text-sm text-gray-400">Balance: {parseFloat(balances[fromToken.symbol] || "0").toFixed(4)}</span>
              </div>
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="0.0"
                  value={swapAmount}
                  onChange={(e) => setSwapAmount(e.target.value)}
                  className="flex-1 bg-transparent text-2xl outline-none"
                />
                <select
                  value={fromToken.symbol}
                  onChange={(e) => setFromToken(TOKENS.find(t => t.symbol === e.target.value)!)}
                  className="bg-gray-700 px-4 py-2 rounded-lg font-semibold"
                >
                  {TOKENS.map((token) => (
                    <option key={token.symbol} value={token.symbol}>{token.symbol}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Switch Button */}
            <div className="flex justify-center -my-2 relative z-10">
              <button
                onClick={switchTokens}
                className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition"
              >
                ⇅
              </button>
            </div>

            {/* To Token */}
            <div className="bg-gray-800 rounded-lg p-4 mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-400">To</span>
                <span className="text-sm text-gray-400">Balance: {parseFloat(balances[toToken.symbol] || "0").toFixed(4)}</span>
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="0.0"
                  value={expectedOutput}
                  readOnly
                  className="flex-1 bg-transparent text-2xl outline-none"
                />
                <select
                  value={toToken.symbol}
                  onChange={(e) => setToToken(TOKENS.find(t => t.symbol === e.target.value)!)}
                  className="bg-gray-700 px-4 py-2 rounded-lg font-semibold"
                >
                  {TOKENS.map((token) => (
                    <option key={token.symbol} value={token.symbol}>{token.symbol}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Slippage */}
            <div className="flex justify-between items-center mb-4 text-sm">
              <span className="text-gray-400">Slippage Tolerance</span>
              <div className="flex gap-2">
                {["0.1", "0.5", "1.0"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSlippage(s)}
                    className={`px-3 py-1 rounded ${slippage === s ? "bg-blue-600" : "bg-gray-700"}`}
                  >
                    {s}%
                  </button>
                ))}
              </div>
            </div>

            {/* Pool Info */}
            <div className="bg-gray-800 rounded-lg p-3 mb-4 text-sm">
              <div className="flex justify-between mb-1">
                <span className="text-gray-400">Pool Reserve {fromToken.symbol}</span>
                <span>{parseFloat(reserves.reserveA).toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Pool Reserve {toToken.symbol}</span>
                <span>{parseFloat(reserves.reserveB).toFixed(4)}</span>
              </div>
            </div>

            <button
              onClick={handleSwap}
              disabled={loading || !swapAmount || parseFloat(swapAmount) <= 0}
              className={`w-full py-3 rounded-lg font-semibold transition ${
                loading || !swapAmount || parseFloat(swapAmount) <= 0
                  ? "bg-gray-700 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Processing..." : "Swap"}
            </button>
          </div>
        )}

        {/* Liquidity Tab */}
        {activeTab === "liquidity" && (
          <div>
            {/* Token Pair Selection */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Token A</label>
                <select
                  value={liquidityTokenA.symbol}
                  onChange={(e) => setLiquidityTokenA(TOKENS.find(t => t.symbol === e.target.value)!)}
                  className="w-full bg-gray-800 px-4 py-2 rounded-lg"
                >
                  {TOKENS.map((token) => (
                    <option key={token.symbol} value={token.symbol}>{token.symbol}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Token B</label>
                <select
                  value={liquidityTokenB.symbol}
                  onChange={(e) => setLiquidityTokenB(TOKENS.find(t => t.symbol === e.target.value)!)}
                  className="w-full bg-gray-800 px-4 py-2 rounded-lg"
                >
                  {TOKENS.map((token) => (
                    <option key={token.symbol} value={token.symbol}>{token.symbol}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Amount Inputs */}
            <div className="space-y-3 mb-4">
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-400">{liquidityTokenA.symbol} Amount</span>
                  <span className="text-sm text-gray-400">Balance: {parseFloat(balances[liquidityTokenA.symbol] || "0").toFixed(4)}</span>
                </div>
                <input
                  type="number"
                  placeholder="0.0"
                  value={amountA}
                  onChange={(e) => setAmountA(e.target.value)}
                  className="w-full bg-transparent text-xl outline-none"
                />
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-400">{liquidityTokenB.symbol} Amount</span>
                  <span className="text-sm text-gray-400">Balance: {parseFloat(balances[liquidityTokenB.symbol] || "0").toFixed(4)}</span>
                </div>
                <input
                  type="number"
                  placeholder="0.0"
                  value={amountB}
                  onChange={(e) => setAmountB(e.target.value)}
                  className="w-full bg-transparent text-xl outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleAddLiquidity}
              disabled={loading || !amountA || !amountB}
              className={`w-full py-3 rounded-lg font-semibold mb-4 transition ${
                loading || !amountA || !amountB
                  ? "bg-gray-700 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "Processing..." : "Add Liquidity"}
            </button>

            {/* Your Liquidity */}
            {(parseFloat(userContribution.a) > 0 || parseFloat(userContribution.b) > 0) && (
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="font-semibold mb-3">Your Liquidity</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{liquidityTokenA.symbol}</span>
                    <span>{parseFloat(userContribution.a).toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{liquidityTokenB.symbol}</span>
                    <span>{parseFloat(userContribution.b).toFixed(4)}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleRemoveLiquidity(25)}
                    disabled={loading}
                    className="bg-red-600 hover:bg-red-700 py-2 rounded text-sm"
                  >
                    25%
                  </button>
                  <button
                    onClick={() => handleRemoveLiquidity(50)}
                    disabled={loading}
                    className="bg-red-600 hover:bg-red-700 py-2 rounded text-sm"
                  >
                    50%
                  </button>
                  <button
                    onClick={() => handleRemoveLiquidity(100)}
                    disabled={loading}
                    className="bg-red-600 hover:bg-red-700 py-2 rounded text-sm"
                  >
                    100%
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Status Message */}
        {message && (
          <div className={`mt-4 p-3 rounded-lg text-center ${
            message.includes("✅") ? "bg-green-900/30" : message.includes("❌") ? "bg-red-900/30" : "bg-blue-900/30"
          }`}>
            {message}
          </div>
        )}
      </div>

      {/* Pool Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <h3 className="font-semibold mb-3">📊 Pool Statistics</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Value Locked</span>
              <span className="font-semibold">
                {(parseFloat(reserves.reserveA) + parseFloat(reserves.reserveB)).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">24h Volume</span>
              <span className="font-semibold">N/A</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Fee Tier</span>
              <span className="font-semibold">0.3%</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <h3 className="font-semibold mb-3">ℹ️ Quick Info</h3>
          <div className="space-y-2 text-sm text-gray-400">
            <p>• Swap any token pair instantly</p>
            <p>• Provide liquidity to earn fees</p>
            <p>• Remove liquidity anytime</p>
            <p>• 0.3% fee distributed to LPs</p>
          </div>
        </div>
      </div>
    </div>
  );
}