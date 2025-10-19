import { useEffect, useMemo, useState } from "react";
import { useProvider, useSigner } from "wagmi";
import { ethers } from "ethers";
import PLT_ABI from "../contracts/abi-PLT.json";
import DEX_ABI from "../contracts/abi-DEX.json";
import DAISY_ABI from "../contracts/abi-DAISY.json";
import MKT_ABI from "../contracts/abi-MKT.json";
import FAUCET_ABI from "../contracts/abi-FAUCET.json";
import { CONTRACT_ADDRESSES } from "../constants";

export default function useContracts() {
  const provider = useProvider();
  const { data: signer } = useSigner();
  const [contracts, setContracts] = useState({});

  useEffect(() => {
    const signerOrProvider = signer?.provider ? signer : provider;
    if (!signerOrProvider) return;

    const plt = new ethers.Contract(CONTRACT_ADDRESSES.PLT, PLT_ABI, signerOrProvider);
    const dex = new ethers.Contract(CONTRACT_ADDRESSES.DEX, DEX_ABI, signerOrProvider);
    const daisy = new ethers.Contract(CONTRACT_ADDRESSES.DAISY, DAISY_ABI, signerOrProvider);
    const mkt = new ethers.Contract(CONTRACT_ADDRESSES.MARKETPLACE, MKT_ABI, signerOrProvider);
    const faucet = new ethers.Contract(CONTRACT_ADDRESSES.FAUCET, FAUCET_ABI, signerOrProvider);

    setContracts({ plt, dex, daisy, mkt, faucet, provider, signer });
  }, [provider, signer]);

  return contracts;
}
