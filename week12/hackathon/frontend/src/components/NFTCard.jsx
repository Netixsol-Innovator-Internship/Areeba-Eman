import { useState } from "react";
import { useAccount } from "wagmi";
import useContracts from "../hooks/useContracts";
import { ethers } from "ethers";

export default function NFTCard({ nft, marketplace }) {
  const { address } = useAccount();
  const { plt } = useContracts();
  const [buying, setBuying] = useState(false);

  const image = nft.uri?.startsWith("ipfs://") ? nft.uri.replace("ipfs://", "https://ipfs.io/ipfs/") : nft.uri;

  async function buy() {
    if (!marketplace || !plt) return alert("Not ready");
    setBuying(true);
    try {
      const price = ethers.parseUnits("1.0", 18); // placeholder; in real use call marketplace.listings(nft.id)
      // approve PLT from buyer to marketplace (user does this separately; show Approve button in UI)
      const allowance = await plt.allowance(address, marketplace.address);
      if (BigInt(allowance) < BigInt(price)) {
        const tx = await plt.approve(marketplace.address, ethers.parseUnits("10000", 18));
        await tx.wait();
      }
      const tx = await marketplace.buyListedItem(nft.id, CONTRACT_ADDRESSES.PLT, 0);
      await tx.wait();
      alert("Bought!");
    } catch (e) {
      alert("Failed: " + (e?.message || e));
    } finally {
      setBuying(false);
    }
  }

  return (
    <div className="bg-gray-800 p-3 rounded">
      <img src={image} alt={`NFT ${nft.id}`} className="w-full h-56 object-cover rounded" />
      <div className="mt-2">
        <p className="font-semibold">NFT #{nft.id}</p>
        <div className="mt-2 flex gap-2">
          <button onClick={buy} disabled={buying} className="bg-green-600 px-3 py-1 rounded">
            {buying ? "Processing..." : "Buy"}
          </button>
        </div>
      </div>
    </div>
  );
}
