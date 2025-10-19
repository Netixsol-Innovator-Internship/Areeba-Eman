import { useEffect, useState } from "react";

/**
 * A light client-side listings fetcher.
 * Since contract mapping isn't iterable, we attempt scanning tokenIDs 1..max
 * and return active listings.
 */
export default function useListings(mktContract, daisyContract, maxScan = 50) {
  const [listings, setListings] = useState([]);
  useEffect(() => {
    if (!mktContract || !daisyContract) return;
    let cancelled = false;
    async function load() {
      const arr = [];
      // If your marketplace exposes totalListings or maxSupply, use that. We'll try daisy.maxSupply if exists
      let max = maxScan;
      try {
        const ms = await daisyContract.maxSupply();
        max = Number(ms);
      } catch {}
      for (let id = 1; id <= max; id++) {
        try {
          const listing = await mktContract.listings(id);
          if (listing && listing.active) {
            arr.push({ tokenId: id, seller: listing.seller, pricePLT: listing.pricePLT });
          }
        } catch (e) {
          // ignore missing
        }
      }
      if (!cancelled) setListings(arr);
    }
    load();
    return () => { cancelled = true; };
  }, [mktContract, daisyContract]);
  return listings;
}
