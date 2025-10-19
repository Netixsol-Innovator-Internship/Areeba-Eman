
import { http, createConfig } from "wagmi";
import { sepolia } from "wagmi/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

export const wagmiConfig =  getDefaultConfig({
    appName: "DEX + NFT Marketplace",
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    chains: [sepolia],
    transports: {
      [sepolia.id]: http(process.env.NEXT_PUBLIC_SEPOLIA_RPC),
    },
    ssr: true,
  })
