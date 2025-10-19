// lib/constants.ts
import { PLATFORM_TOKEN_ABI } from "@/abis/PLT_ABI";
import { FAUCET_ABI } from "@/abis/FAUCET_ABI";
import { DEX_ABI } from "@/abis/DEX_ABI"; // ✅ Named import
import { NFT_ABI } from "@/abis/NFT_ABI";
import { MARKET_ABI } from "@/abis/MARKET_ABI";

export const CONTRACTS: Record<string, `0x${string}`> = {
  PLT: "0xA8cefA1d97778C4455CdB8Ede196A110985d9607",
  FAUCET: "0xE2C1A367F57084781245fe06F6FdF5A84599036A",
  DEX: "0x2F352F1Ae58D336DB0e60C33f96d60EB35BAB200",
  NFT: "0x57b7ab546ebCb9C01E41e71C6aa693743f62F397",
  MARKETPLACE: "0x02352bCcFf1368D8C85710faF7C381d9FddeE1bb",
  ARB: "0x5f17ca2dC1c745dFe001D9227dA245577d22eBDc",
  LU: "0x76A1C34B46AdB7Afa80ACeC6eF843777B2048D41",
};

// ✅ Export all ABIs
export { PLATFORM_TOKEN_ABI, FAUCET_ABI, DEX_ABI, NFT_ABI, MARKET_ABI };

// Legacy export for backward compatibility
export const PLATFORM_TOKEN_ADDRESS = CONTRACTS.PLT;