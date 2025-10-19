"use client";

import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { wagmiConfig } from "@/lib/wagmiConfig";
import { ReactNode } from "react";
import Navbar from "@/components/Navbar";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>
              <div className="min-h-screen bg-gray-950 text-white">
                <Navbar />
                <main className="container mx-auto p-6">{children}</main>
              </div>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
