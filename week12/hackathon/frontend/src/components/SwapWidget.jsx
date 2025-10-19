import { useState } from "react";
import TokenSelector from "./TokenSelector";

export default function SwapWidget({ dex }) {
  const [from, setFrom] = useState("PLT");
  const [to, setTo] = useState("ARB");
  const [amount, setAmount] = useState("");
  const [output, setOutput] = useState("");

  async function previewSwap() {
    try {
      const val = await dex.previewSwap(from, to, amount);
      setOutput(val.toString());
    } catch (e) {
      console.error(e);
    }
  }

  async function executeSwap() {
    const tx = await dex.swap(from, to, amount, output);
    await tx.wait();
    alert("✅ Swap complete");
  }

  return (
    <div className="bg-gray-100 p-6 rounded-2xl max-w-md mx-auto shadow-md">
      <h2 className="font-semibold mb-4">Swap Tokens</h2>
      <div className="flex space-x-2 mb-3">
        <TokenSelector selected={from} onChange={setFrom} tokens={["PLT", "ARB", "LUX"]} />
        <TokenSelector selected={to} onChange={setTo} tokens={["PLT", "ARB", "LUX"]} />
      </div>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full border rounded-md p-2 mb-3"
      />
      <button
        onClick={previewSwap}
        className="bg-gray-600 text-white w-full py-2 rounded-md mb-2"
      >
        Preview
      </button>
      {output && <p className="text-sm text-gray-600 mb-2">Output: {output}</p>}
      <button
        onClick={executeSwap}
        className="bg-blue-600 text-white w-full py-2 rounded-md"
      >
        Swap
      </button>
    </div>
  );
}
