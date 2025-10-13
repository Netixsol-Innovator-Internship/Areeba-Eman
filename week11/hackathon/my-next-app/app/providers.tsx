'use client';

import { WagmiProvider, createConfig, http } from 'wagmi';
import { injected } from '@wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { defineChain } from 'viem';

export const kasplexTestnet = defineChain({
  id: 167012,
  name: 'Kasplex Testnet',
  nativeCurrency: { name: 'Kas', symbol: 'kas', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.kasplextest.xyz/'] },
  },
  blockExplorers: {
    default: { name: 'Kasplex Explorer', url: 'https://testnet.kasplex.org' },
  },
  testnet: true,
});

const config = createConfig({
  chains: [kasplexTestnet],
  transports: {
  [kasplexTestnet.id]: http('https://rpc.kasplextest.xyz/'),
},

  connectors: [injected()],
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
