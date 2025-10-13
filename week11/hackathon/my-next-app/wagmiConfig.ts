import { http, createConfig } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { defineChain } from 'viem';

// 🔹 Define Kasplex Testnet
export const kasplex = defineChain({
  id: 1337, // replace with your Kasplex chainId if known
  name: 'Kasplex Testnet',
  nativeCurrency: {
    name: 'kas',
    symbol: 'kas',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://rpc.kasplex.net'] }, // Replace with actual Kasplex RPC URL
  },
  blockExplorers: {
    default: { name: 'Kasplex Explorer', url: 'https://explorer.kasplex.net' },
  },
});

// 🔹 Create Wagmi Config
export const config = createConfig({
  chains: [kasplex],
  connectors: [injected()],
  transports: {
    [kasplex.id]: http('https://rpc.kasplex.net'), // again, replace with correct RPC
  },
});
