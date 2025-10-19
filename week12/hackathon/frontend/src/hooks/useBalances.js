import { useEffect, useState } from "react";
import { ethers } from "ethers";

export default function useBalances(tokenContracts = {}, address) {
  const [balances, setBalances] = useState({});
  useEffect(() => {
    if (!address || !tokenContracts) return;
    let stale = false;
    async function load() {
      const out = {};
      for (const [sym, contract] of Object.entries(tokenContracts)) {
        try {
          const b = await contract.balanceOf(address);
          out[sym] = ethers.formatUnits(b, 18);
        } catch (e) {
          out[sym] = "0";
        }
      }
      if (!stale) setBalances(out);
    }
    load();
    return () => { stale = true; };
  }, [tokenContracts, address]);
  return balances;
}
