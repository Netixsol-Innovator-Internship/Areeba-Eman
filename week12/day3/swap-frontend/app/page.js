"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  SIMPLE_SWAP_ABI,
  ERC20_ABI,
  SIMPLE_SWAP_ADDRESS,
  TOKEN_A_ADDRESS,
  TOKEN_B_ADDRESS,
} from "./config";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export default function Home() {
  const { address, isConnected } = useAccount();
  const [reserves, setReserves] = useState({ A: 0, B: 0 });
  const [balances, setBalances] = useState({ A: 0, B: 0 });
  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");
  const [expectedSwap, setExpectedSwap] = useState("");
  const [chartData, setChartData] = useState([]);

  async function getProvider() {
    if (!window.ethereum) throw new Error("Wallet not found");
    return new ethers.BrowserProvider(window.ethereum);
  }

  async function getContract(address, abi) {
    const provider = await getProvider();
    const signer = await provider.getSigner();
    return new ethers.Contract(address, abi, signer);
  }

  async function loadReserves() {
    try {
      const contract = await getContract(SIMPLE_SWAP_ADDRESS, SIMPLE_SWAP_ABI);
      const tokenA = await getContract(TOKEN_A_ADDRESS, ERC20_ABI);
      const tokenB = await getContract(TOKEN_B_ADDRESS, ERC20_ABI);

      const [a, b] = await contract.getReserves();
      const reserveA = Number(ethers.formatEther(a));
      const reserveB = Number(ethers.formatEther(b));

      const balA = Number(ethers.formatEther(await tokenA.balanceOf(SIMPLE_SWAP_ADDRESS)));
      const balB = Number(ethers.formatEther(await tokenB.balanceOf(SIMPLE_SWAP_ADDRESS)));

      setReserves({ A: reserveA, B: reserveB });
      setBalances({ A: balA, B: balB });

      setChartData((prev) => [
        ...prev.slice(-9),
        {
          time: new Date().toLocaleTimeString(),
          reserveA,
          reserveB,
          price: reserveA > 0 ? reserveB / reserveA : 0,
        },
      ]);
    } catch (err) {
      console.error("Error loading reserves:", err);
    }
  }

  async function previewSwap(amountIn, swapAforB) {
    try {
      const contract = await getContract(SIMPLE_SWAP_ADDRESS, SIMPLE_SWAP_ABI);
      const amountInWei = ethers.parseEther(amountIn || "0");
      const result = await contract.getSwapAmount(amountInWei, swapAforB);
      setExpectedSwap(ethers.formatEther(result));
    } catch {
      setExpectedSwap("");
    }
  }

  async function addLiquidity() {
    if (!isConnected) return alert("Connect your wallet first!");
    try {
      const contract = await getContract(SIMPLE_SWAP_ADDRESS, SIMPLE_SWAP_ABI);
      const tokenA = await getContract(TOKEN_A_ADDRESS, ERC20_ABI);
      const tokenB = await getContract(TOKEN_B_ADDRESS, ERC20_ABI);

      const amountAWei = ethers.parseEther(amountA);
      const amountBWei = ethers.parseEther(amountB);

      await tokenA.approve(SIMPLE_SWAP_ADDRESS, amountAWei);
      await tokenB.approve(SIMPLE_SWAP_ADDRESS, amountBWei);

      const tx = await contract.addLiquidity(amountAWei, amountBWei);
      await tx.wait();

      alert("✅ Liquidity added!");
      await loadReserves();
    } catch (err) {
      console.error(err);
      alert("❌ Transaction failed!");
    }
  }

  async function swapAforB() {
    if (!isConnected) return alert("Connect your wallet first!");
    try {
      const contract = await getContract(SIMPLE_SWAP_ADDRESS, SIMPLE_SWAP_ABI);
      const tokenA = await getContract(TOKEN_A_ADDRESS, ERC20_ABI);
      const amountIn = ethers.parseEther(amountA);

      const allowance = await tokenA.allowance(address, SIMPLE_SWAP_ADDRESS);
      if (allowance < amountIn) {
        await tokenA.approve(SIMPLE_SWAP_ADDRESS, ethers.MaxUint256);
      }

      const tx = await contract.swapAforB(amountIn);
      await tx.wait();
      alert("✅ Swap A → B complete!");
      await loadReserves();
    } catch (err) {
      console.error(err);
      alert("❌ Swap failed!");
    }
  }

  async function swapBforA() {
    if (!isConnected) return alert("Connect your wallet first!");
    try {
      const contract = await getContract(SIMPLE_SWAP_ADDRESS, SIMPLE_SWAP_ABI);
      const tokenB = await getContract(TOKEN_B_ADDRESS, ERC20_ABI);
      const amountIn = ethers.parseEther(amountB);

      const allowance = await tokenB.allowance(address, SIMPLE_SWAP_ADDRESS);
      if (allowance < amountIn) {
        await tokenB.approve(SIMPLE_SWAP_ADDRESS, ethers.MaxUint256);
      }

      const tx = await contract.swapBforA(amountIn);
      await tx.wait();
      alert("✅ Swap B → A complete!");
      await loadReserves();
    } catch (err) {
      console.error(err);
      alert("❌ Swap failed!");
    }
  }

  useEffect(() => {
    if (isConnected) {
      loadReserves();
      const interval = setInterval(loadReserves, 10000);
      return () => clearInterval(interval);
    }
  }, [isConnected]);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-6">💧 SimpleSwap DEX</h1>
      <ConnectButton />

      {isConnected && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10 w-full max-w-6xl">
          {/* LEFT COLUMN — Pool Overview + Chart */}
          <div className="space-y-6">
            <div className="bg-gray-900 p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold mb-2">📊 Pool Overview</h2>
              <p>Reserve A: {reserves.A.toFixed(4)}</p>
              <p>Reserve B: {reserves.B.toFixed(4)}</p>
              <p>TokenA Balance: {balances.A.toFixed(4)}</p>
              <p>TokenB Balance: {balances.B.toFixed(4)}</p>
              <p>Price (B/A): {(reserves.B / reserves.A || 0).toFixed(4)}</p>
            </div>

            <div className="bg-gray-900 p-6 rounded-xl shadow-lg">
              <h2 className="text-lg mb-4 font-semibold">📈 Liquidity & Price Graph</h2>
              <LineChart width={500} height={280} data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="reserveA" stroke="#8884d8" name="Reserve A" />
                <Line type="monotone" dataKey="reserveB" stroke="#82ca9d" name="Reserve B" />
                <Line type="monotone" dataKey="price" stroke="#ffc658" name="Price (B/A)" />
              </LineChart>
            </div>
          </div>

          {/* RIGHT COLUMN — Add Liquidity + Swap */}
          <div className="space-y-6">
            <div className="bg-gray-900 p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold">💦 Add Liquidity</h2>
              <input
                type="text"
                placeholder="Amount Token A (in Ether)"
                className="p-2 w-full rounded bg-gray-800 mt-2"
                onChange={(e) => setAmountA(e.target.value)}
              />
              <input
                type="text"
                placeholder="Amount Token B (in Ether)"
                className="p-2 w-full rounded bg-gray-800 mt-2"
                onChange={(e) => setAmountB(e.target.value)}
              />
              <button
                onClick={addLiquidity}
                className="bg-blue-600 w-full py-2 rounded mt-3 hover:bg-blue-700"
              >
                Add Liquidity
              </button>
            </div>

            <div className="bg-gray-900 p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold">🔄 Swap Tokens</h2>

              <div className="mt-2">
                <h3 className="font-semibold mb-2">Swap A → B</h3>
                <input
                  type="text"
                  placeholder="Amount A (in Ether)"
                  className="p-2 w-full rounded bg-gray-800"
                  value={amountA}
                  onChange={(e) => {
                    setAmountA(e.target.value);
                    previewSwap(e.target.value, true);
                  }}
                />
                {expectedSwap && (
                  <p className="text-gray-400 text-sm mt-1">
                    You’ll receive ≈ {expectedSwap} B
                  </p>
                )}
                <button
                  onClick={swapAforB}
                  className="bg-green-600 w-full py-2 rounded mt-2 hover:bg-green-700"
                >
                  Swap A → B
                </button>
              </div>

              <div className="border-t border-gray-700 pt-4 mt-4">
                <h3 className="font-semibold mb-2">Swap B → A</h3>
                <input
                  type="text"
                  placeholder="Amount B (in Ether)"
                  className="p-2 w-full rounded bg-gray-800"
                  value={amountB}
                  onChange={(e) => {
                    setAmountB(e.target.value);
                    previewSwap(e.target.value, false);
                  }}
                />
                {expectedSwap && (
                  <p className="text-gray-400 text-sm mt-1">
                    You’ll receive ≈ {expectedSwap} A
                  </p>
                )}
                <button
                  onClick={swapBforA}
                  className="bg-yellow-600 w-full py-2 rounded mt-2 hover:bg-yellow-700"
                >
                  Swap B → A
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
