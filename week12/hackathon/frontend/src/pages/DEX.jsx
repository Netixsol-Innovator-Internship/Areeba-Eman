"use client";
import { useEffect, useState } from "react";
import useContracts from "../hooks/useContracts";
import { ethers } from "ethers";

export default function DEXPage() {
  const { dex, plt } = useContracts();
  const [from, setFrom] = useState("PLT");
  const [to, setTo] = useState("ARB");
  const [amountIn, setAmountIn] = useState("");
  const [amountOut, setAmountOut] = useState("0");
  const [tokenAddrs, setTokenAddrs] = useState({ PLT: "", ARB: "", LU: "" });

  useEffect(() => {
    if (!plt) return;
    // read addresses from constants via contract instances
  }, [plt]);

  async function preview() {
    if (!dex || !amountIn) return;
    // convert symbols to addresses - use constants via import
    const { CONTRACT_ADDRESSES } = await import("../constants");
    const inAddr = CONTRACT_ADDRESSES[from];
    const outAddr = CONTRACT_ADDRESSES[to];
    const amt = ethers.parseUnits(amountIn || "0", 18);
    try {
      const out = await dex.previewSwap(inAddr, outAddr, amt);
      setAmountOut(ethers.formatUnits(out, 18));
    } catch (e) {
      setAmountOut("0");
      console.error(e);
    }
  }

  async function execSwap() {
    const { CONTRACT_ADDRESSES } = await import("../constants");
    const inAddr = CONTRACT_ADDRESSES[from];
    const outAddr = CONTRACT_ADDRESSES[to];
    const amt = ethers.parseUnits(amountIn || "0", 18);
    // approve dex
    const signer = dex.signer || dex.provider;
    const tokenContract = new ethers.Contract(inAddr, (await import("../contracts/abi-PLT.json")).default, signer);
    await tokenContract.approve(dex.address, amt);
    const minOut = 0;
    const tx = await dex.swap(inAddr, outAddr, amt, minOut);
    await tx.wait();
    alert("Swap executed");
  }

  return (
    <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-xl">
      <h2 className="text-2xl font-bold mb-4">💱 DEX</h2>
      <div className="grid grid-cols-2 gap-3">
        <select value={from} onChange={(e) => setFrom(e.target.value)} className="p-2 rounded">
          <option>PLT</option><option>ARB</option><option>LU</option>
        </select>
        <select value={to} onChange={(e) => setTo(e.target.value)} className="p-2 rounded">
          <option>ARB</option><option>PLT</option><option>LU</option>
        </select>
      </div>

      <input
        className="w-full mt-4 p-2 rounded bg-gray-700"
        placeholder="Amount"
        value={amountIn}
        onChange={(e) => setAmountIn(e.target.value)}
      />

      <div className="mt-3 flex gap-2">
        <button onClick={preview} className="bg-gray-600 px-3 py-2 rounded">Preview</button>
        <button onClick={execSwap} className="bg-blue-600 px-3 py-2 rounded">Swap</button>
      </div>

      <p className="mt-3">Estimated out: {amountOut}</p>
    </div>
  );
}
