import { useState } from "react";

export default function ApproveButton({ tokenContract, spender, amount = "1000000" }) {
  const [status, setStatus] = useState("");

  async function doApprove() {
    try {
      setStatus("Pending...");
      const tx = await tokenContract.approve(spender, ethers.parseUnits(amount, 18));
      await tx.wait();
      setStatus("Approved");
    } catch (e) {
      setStatus("Failed: " + (e.message || e));
    }
  }

  return (
    <button onClick={doApprove} className="bg-yellow-500 px-3 py-1 rounded">
      {status || "Approve"}
    </button>
  );
}
