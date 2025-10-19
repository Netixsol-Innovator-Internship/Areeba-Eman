"use client";
import useContracts from "../hooks/useContracts";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import NFTCard from "../components/NFTCard";
import { ethers } from "ethers";

export default function PortfolioPage() {
  const { address } = useAccount();
  const { plt, daisy } = useContracts();
  const [balances, setBalances] = useState({});
  const [owned, setOwned] = useState([]);

  useEffect(() => {
    if (!plt || !address) return;
    async function load() {
      const b = await plt.balanceOf(address);
      setBalances({ PLT: ethers.formatUnits(b, 18) });
    }
    load();
  }, [plt, address]);

  useEffect(() => {
    if (!daisy || !address) return;
    async function load() {
      const total = Number(await daisy.totalMinted());
      const arr = [];
      for (let i = 1; i <= total; i++) {
        try {
          const owner = await daisy.ownerOf(i);
          if (owner.toLowerCase() === address.toLowerCase()) {
            const uri = await daisy.tokenURI(i);
            arr.push({ id: i, uri });
          }
        } catch {}
      }
      setOwned(arr);
    }
    load();
  }, [daisy, address]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">📦 Portfolio</h2>
      <div className="mb-4">PLT Balance: <strong>{balances.PLT ?? "0"}</strong></div>
      <h3 className="text-xl mb-2">Your NFTs</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {owned.map(n => <NFTCard key={n.id} nft={n} />)}
      </div>
    </div>
  );
}
