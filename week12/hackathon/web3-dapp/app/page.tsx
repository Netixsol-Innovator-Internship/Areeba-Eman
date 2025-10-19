"use client";

import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isConnected } = useAccount();
  const router = useRouter();

  const features = [
    {
      icon: "🎁",
      title: "Token Faucet",
      description: "Claim free PLT tokens every 24 hours to get started",
      link: "/faucet",
      color: "from-blue-600 to-cyan-600"
    },
    {
      icon: "💱",
      title: "Multi-Token DEX",
      description: "Swap PLT, ARB, and LU tokens with low fees",
      link: "/dex",
      color: "from-green-600 to-emerald-600"
    },
    {
      icon: "🖼️",
      title: "NFT Marketplace",
      description: "Mint, buy, and sell unique Daisy NFTs",
      link: "/marketplace",
      color: "from-purple-600 to-pink-600"
    },
    {
      icon: "📊",
      title: "Portfolio",
      description: "Track your tokens, NFTs, and manage approvals",
      link: "/portfolio",
      color: "from-orange-600 to-red-600"
    }
  ];

  const stats = [
    { label: "Tokens Supported", value: "3" },
    { label: "Trading Pairs", value: "3" },
    { label: "NFT Collection", value: "100" },
    { label: "Network", value: "Sepolia" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-600/20 via-transparent to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-32 sm:pb-32">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-purple-900/30 border border-purple-500/50 rounded-full px-4 py-2 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              <span className="text-sm font-medium">Built on Ethereum Sepolia</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Your Complete
              <br />
              Web3 DApp Suite
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Trade tokens, collect NFTs, and manage your crypto portfolio — all in one seamless platform
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {isConnected ? (
                <>
                  <button
                    onClick={() => router.push('/faucet')}
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition transform hover:scale-105 shadow-lg shadow-purple-500/50"
                  >
                    Get Started 🚀
                  </button>
                  <button
                    onClick={() => router.push('/portfolio')}
                    className="px-8 py-4 bg-gray-800 border border-gray-700 rounded-lg font-semibold text-lg hover:bg-gray-700 transition"
                  >
                    View Portfolio
                  </button>
                </>
              ) : (
                <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg px-6 py-4">
                  <p className="text-blue-300">👆 Connect your wallet to get started</p>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            {stats.map((stat, index) => (
              <div key={index} className="text-center bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                <p className="text-3xl sm:text-4xl font-bold text-purple-400 mb-2">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Everything You Need</h2>
          <p className="text-xl text-gray-400">Powerful features for the modern DeFi user</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              onClick={() => router.push(feature.link)}
              className="group relative bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-purple-500/50 transition-all cursor-pointer transform hover:scale-105"
            >
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity`}></div>
              
              <div className="relative">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 mb-4">{feature.description}</p>
                <div className="flex items-center text-purple-400 font-semibold group-hover:text-purple-300">
                  Explore <span className="ml-2 transform group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-900/50 border-y border-gray-800 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-400">Get started in three simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold mb-3">Connect Wallet</h3>
              <p className="text-gray-400">Connect your MetaMask or any Web3 wallet to the Sepolia testnet</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold mb-3">Claim Tokens</h3>
              <p className="text-gray-400">Get free PLT tokens from the faucet to start trading and minting</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold mb-3">Start Trading</h3>
              <p className="text-gray-400">Swap tokens, mint NFTs, and explore the full DeFi experience</p>
            </div>
          </div>
        </div>
      </div>

      {/* Supported Tokens */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Supported Tokens</h2>
          <p className="text-xl text-gray-400">Trade with multiple tokens seamlessly</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center hover:border-yellow-500/50 transition">
            <div className="text-5xl mb-4">💵</div>
            <h3 className="text-2xl font-bold mb-2">PLT</h3>
            <p className="text-gray-400">Platform Token</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center hover:border-blue-500/50 transition">
            <div className="text-5xl mb-4">🔷</div>
            <h3 className="text-2xl font-bold mb-2">ARB</h3>
            <p className="text-gray-400">Arbitrum Token</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center hover:border-purple-500/50 transition">
            <div className="text-5xl mb-4">🌙</div>
            <h3 className="text-2xl font-bold mb-2">LU</h3>
            <p className="text-gray-400">Lunar Token</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-pink-900/20"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Ready to Start Your
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Web3 Journey?
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join the decentralized revolution today
          </p>
          {isConnected ? (
            <button
              onClick={() => router.push('/faucet')}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition transform hover:scale-105 shadow-lg shadow-purple-500/50"
            >
              Get Free Tokens 🎁
            </button>
          ) : (
            <div className="inline-block bg-blue-900/30 border border-blue-500/50 rounded-lg px-8 py-4">
              <p className="text-blue-300 font-semibold">Connect wallet to get started →</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              Built with ❤️ using Next.js, Wagmi, and RainbowKit
            </div>
            <div className="flex gap-4 text-sm text-gray-400">
              <span>Network: Sepolia Testnet</span>
              <span>•</span>
              <span>Gas Fees: Test ETH</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}