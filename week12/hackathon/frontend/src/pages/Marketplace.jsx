"use client";
import { useEffect, useState } from "react";
import useContracts from "../hooks/useContracts";
import useListings from "../hooks/useListings";
import NFTCard from "../components/NFTCard";

export default function MarketplacePage() {
  const { mkt, daisy } = useContracts();
  const listings = useListings(mkt, daisy, 50);
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    if (!daisy) return;
    let mounted = true;
    async function load() {
      try {
        const total = Number(await daisy.totalMinted());
        const arr = [];
        for (let i = 1; i <= total; i++) {
          const uri = await daisy.tokenURI(i);
          arr.push({ id: i, uri });
        }
        if (mounted) setGallery(arr);
      } catch (e) {
        console.error(e);
      }
    }
    load();
    return () => { mounted = false; };
  }, [daisy]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">🎨 Marketplace</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {gallery.map(nft => (
          <NFTCard key={nft.id} nft={nft} marketplace={mkt} />
        ))}
      </div>

      <h3 className="mt-8 text-xl font-semibold">Active Listings</h3>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {listings.map(l => (
          <div key={l.tokenId} className="bg-gray-800 p-4 rounded">
            <p>Token #{l.tokenId}</p>
            <p>Seller: {l.seller}</p>
            <p>Price (PLT): {Number(l.pricePLT) / 1e18}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
