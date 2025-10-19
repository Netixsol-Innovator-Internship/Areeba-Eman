"use client";

import { WagmiProvider, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";
import "@rainbow-me/rainbowkit/styles.css";

const config = getDefaultConfig({
  appName: "SimpleSwap DEX",
  projectId: "4acc473fda6ae6852a613166a0a3f3c8",
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
});

const queryClient = new QueryClient();

export default function Providers({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
