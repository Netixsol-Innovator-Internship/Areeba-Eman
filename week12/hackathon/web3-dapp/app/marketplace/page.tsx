"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { writeContract, waitForTransactionReceipt, readContract } from "wagmi/actions";
import { MARKET_ABI, NFT_ABI, PLATFORM_TOKEN_ABI, CONTRACTS } from "@/lib/constants";
import { wagmiConfig } from "@/lib/wagmiConfig";
import { parseEther, formatEther } from "viem";

const TOKENS = [
  { symbol: "PLT", address: CONTRACTS.PLT, name: "Platform Token", icon: "💵" },
  { symbol: "ARB", address: CONTRACTS.ARB, name: "Arbitrum Token", icon: "🔷" },
  { symbol: "LU", address: CONTRACTS.LU, name: "Lunar Token", icon: "🌙" },
];

interface NFTListing {
  tokenId: number;
  seller: string;
  pricePLT: string;
  active: boolean;
  owner?: string;
  imageUrl?: string;
  name?: string;
  description?: string;
  attributes?: Array<{trait_type: string; value: string}>;
}

export default function MarketplacePage() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<"mint" | "all-nfts" | "marketplace" | "my-nfts" | "royalties">("mint");
  
  // State
  const [nftPrice, setNftPrice] = useState("0");
  const [maxSupply, setMaxSupply] = useState("0");
  const [totalMinted, setTotalMinted] = useState("0");
  const [paymentToken, setPaymentToken] = useState(TOKENS[0]);
  const [listings, setListings] = useState<NFTListing[]>([]);
  const [allNFTs, setAllNFTs] = useState<NFTListing[]>([]);
  const [myNFTs, setMyNFTs] = useState<NFTListing[]>([]);
  const [listPrice, setListPrice] = useState("");
  const [selectedNFT, setSelectedNFT] = useState<number | null>(null);
  const [selectedNFTId, setSelectedNFTId] = useState<number | null>(null);
  const [royaltyReceiver, setRoyaltyReceiver] = useState("");
  const [royaltyPercentage, setRoyaltyPercentage] = useState("0");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  // Fetch NFT metadata from tokenURI
  const fetchNFTMetadata = async (tokenId: number) => {
    try {
      const tokenURI = await readContract(wagmiConfig, {
        address: CONTRACTS.NFT as `0x${string}`,
        abi: NFT_ABI,
        functionName: "tokenURI",
        args: [BigInt(tokenId)],
      });

      // Convert IPFS URI to HTTPS
      let metadataUrl = tokenURI as string;
      if (metadataUrl.startsWith("ipfs://")) {
        metadataUrl = metadataUrl.replace("ipfs://", "https://ipfs.io/ipfs/");
      }

      const response = await fetch(metadataUrl);
      const metadata = await response.json();

      // Fix image URL if also IPFS
      let imageUrl = metadata.image;
      if (imageUrl.startsWith("ipfs://")) {
        imageUrl = imageUrl.replace("ipfs://", "https://ipfs.io/ipfs/");
      }

      return {
        name: metadata.name || `Daisy #${tokenId}`,
        description: metadata.description || "",
        imageUrl: imageUrl || `https://placehold.co/300x300/1a1a1a/white?text=Daisy+%23${tokenId}`,
        attributes: metadata.attributes || [],
      };
    } catch (err) {
      console.error(`Error fetching metadata for token ${tokenId}:`, err);
      return {
        name: `Daisy #${tokenId}`,
        description: "",
        imageUrl: `https://placehold.co/300x300/1a1a1a/white?text=Daisy+%23${tokenId}`,
        attributes: [],
      };
    }
  };

  // Fetch marketplace data
  const fetchMarketplaceData = async () => {
    try {
      const [price, supply, minted] = await Promise.all([
        readContract(wagmiConfig, {
          address: CONTRACTS.MARKETPLACE as `0x${string}`,
          abi: MARKET_ABI,
          functionName: "nftPricePLT",
        }),
        readContract(wagmiConfig, {
          address: CONTRACTS.NFT as `0x${string}`,
          abi: NFT_ABI,
          functionName: "maxSupply",
        }),
        readContract(wagmiConfig, {
          address: CONTRACTS.NFT as `0x${string}`,
          abi: NFT_ABI,
          functionName: "totalMinted",
        }),
      ]);

      setNftPrice(formatEther(price as bigint));
      setMaxSupply((supply as bigint).toString());
      setTotalMinted((minted as bigint).toString());
    } catch (err) {
      console.error("Error fetching marketplace data:", err);
    }
  };

  // Fetch all NFTs
  const fetchAllNFTs = async () => {
    try {
      const allNFTsList: NFTListing[] = [];
      const totalMintedNum = parseInt(totalMinted);
      
      for (let i = 1; i <= Math.min(totalMintedNum, 100); i++) {
        try {
          const owner = await readContract(wagmiConfig, {
            address: CONTRACTS.NFT as `0x${string}`,
            abi: NFT_ABI,
            functionName: "ownerOf",
            args: [BigInt(i)],
          });

          // Check if listed
          let isListed = false;
          let listingPrice = "0";
          try {
            const listing = await readContract(wagmiConfig, {
              address: CONTRACTS.MARKETPLACE as `0x${string}`,
              abi: MARKET_ABI,
              functionName: "listings",
              args: [BigInt(i)],
            });
            const [, pricePLT, active] = listing as [string, bigint, boolean];
            isListed = active;
            listingPrice = formatEther(pricePLT);
          } catch {}

          const metadata = await fetchNFTMetadata(i);
          allNFTsList.push({
            tokenId: i,
            seller: owner as string,
            pricePLT: listingPrice,
            active: isListed,
            owner: owner as string,
            ...metadata,
          });
        } catch (err) {
          // Token doesn't exist
        }
      }
      
      setAllNFTs(allNFTsList);
    } catch (err) {
      console.error("Error fetching all NFTs:", err);
    }
  };

  // Fetch listings
  const fetchListings = async () => {
    try {
      const listedNFTs: NFTListing[] = [];
      const totalMintedNum = parseInt(totalMinted);
      
      for (let i = 1; i <= Math.min(totalMintedNum, 50); i++) {
        try {
          const listing = await readContract(wagmiConfig, {
            address: CONTRACTS.MARKETPLACE as `0x${string}`,
            abi: MARKET_ABI,
            functionName: "listings",
            args: [BigInt(i)],
          });

          const [seller, pricePLT, active] = listing as [string, bigint, boolean];
          
          if (active) {
            const metadata = await fetchNFTMetadata(i);
            listedNFTs.push({
              tokenId: i,
              seller,
              pricePLT: formatEther(pricePLT),
              active,
              ...metadata,
            });
          }
        } catch (err) {
          // NFT not listed, skip
        }
      }
      
      setListings(listedNFTs);
    } catch (err) {
      console.error("Error fetching listings:", err);
    }
  };

  // Fetch user's NFTs
  const fetchMyNFTs = async () => {
    if (!address) return;
    try {
      const myNFTsList: NFTListing[] = [];
      const totalMintedNum = parseInt(totalMinted);
      
      for (let i = 1; i <= Math.min(totalMintedNum, 50); i++) {
        try {
          const owner = await readContract(wagmiConfig, {
            address: CONTRACTS.NFT as `0x${string}`,
            abi: NFT_ABI,
            functionName: "ownerOf",
            args: [BigInt(i)],
          });

          if ((owner as string).toLowerCase() === address.toLowerCase()) {
            const metadata = await fetchNFTMetadata(i);
            myNFTsList.push({
              tokenId: i,
              seller: address,
              pricePLT: "0",
              active: false,
              owner: address,
              ...metadata,
            });
          }
        } catch (err) {
          // Token doesn't exist or error
        }
      }
      
      setMyNFTs(myNFTsList);
    } catch (err) {
      console.error("Error fetching my NFTs:", err);
    }
  };

  // Fetch royalty info
  const fetchRoyaltyInfo = async () => {
    try {
      const salePrice = parseEther("100");
      const royaltyInfo = await readContract(wagmiConfig, {
        address: CONTRACTS.NFT as `0x${string}`,
        abi: NFT_ABI,
        functionName: "royaltyInfo",
        args: [BigInt(1), salePrice],
      });

      const [receiver, royaltyAmount] = royaltyInfo as [string, bigint];
      setRoyaltyReceiver(receiver);
      setRoyaltyPercentage(((Number(royaltyAmount) / Number(salePrice)) * 100).toFixed(2));
    } catch (err) {
      console.error("Error fetching royalty info:", err);
    }
  };

  useEffect(() => {
    if (isConnected) {
      fetchMarketplaceData();
    }
  }, [isConnected]);

  useEffect(() => {
    if (totalMinted !== "0") {
      fetchListings();
      fetchAllNFTs();
      fetchRoyaltyInfo();
      if (address) fetchMyNFTs();
    }
  }, [totalMinted, address, activeTab]);

  // Approve token
  const approveToken = async (tokenAddress: string, amount: string) => {
    const txHash = await writeContract(wagmiConfig, {
      address: tokenAddress as `0x${string}`,
      abi: PLATFORM_TOKEN_ABI,
      functionName: "approve",
      args: [CONTRACTS.MARKETPLACE, parseEther(amount)],
      account: address,
    });
    await waitForTransactionReceipt(wagmiConfig, { hash: txHash });
  };

  // Mint new NFT
  const handleMintNFT = async () => {
    if (!address) return;
    setLoading(true);
    setMessage("");
    try {
      setMessage("Approving payment token...");
      await approveToken(paymentToken.address, (parseFloat(nftPrice) * 2).toString());

      setMessage("Minting NFT...");
      const txHash = await writeContract(wagmiConfig, {
        address: CONTRACTS.MARKETPLACE as `0x${string}`,
        abi: MARKET_ABI,
        functionName: "buyNewNFT",
        args: [paymentToken.address, parseEther("0")],
        account: address,
      });

      setMessage("Waiting for confirmation...");
      await waitForTransactionReceipt(wagmiConfig, { hash: txHash });

      setMessage("✅ NFT minted successfully!");
      await fetchMarketplaceData();
      await fetchMyNFTs();
      await fetchAllNFTs();
    } catch (err: any) {
      console.error(err);
      setMessage(`❌ ${err.message || "Minting failed"}`);
    } finally {
      setLoading(false);
    }
  };

  // List NFT for sale
  const handleListNFT = async (tokenId: number) => {
    if (!address || !listPrice) return;
    setLoading(true);
    setMessage("");
    try {
      setMessage("Approving NFT transfer...");
      const approveTxHash = await writeContract(wagmiConfig, {
        address: CONTRACTS.NFT as `0x${string}`,
        abi: NFT_ABI,
        functionName: "approve",
        args: [CONTRACTS.MARKETPLACE, BigInt(tokenId)],
        account: address,
      });
      await waitForTransactionReceipt(wagmiConfig, { hash: approveTxHash });

      setMessage("Listing NFT...");
      const txHash = await writeContract(wagmiConfig, {
        address: CONTRACTS.MARKETPLACE as `0x${string}`,
        abi: MARKET_ABI,
        functionName: "listItem",
        args: [BigInt(tokenId), parseEther(listPrice)],
        account: address,
      });

      setMessage("Waiting for confirmation...");
      await waitForTransactionReceipt(wagmiConfig, { hash: txHash });

      setMessage("✅ NFT listed successfully!");
      setListPrice("");
      setSelectedNFT(null);
      await fetchListings();
      await fetchMyNFTs();
      await fetchAllNFTs();
    } catch (err: any) {
      console.error(err);
      setMessage(`❌ ${err.message || "Listing failed"}`);
    } finally {
      setLoading(false);
    }
  };

  // Cancel listing
  const handleCancelListing = async (tokenId: number) => {
    if (!address) return;
    setLoading(true);
    setMessage("");
    try {
      setMessage("Cancelling listing...");
      const txHash = await writeContract(wagmiConfig, {
        address: CONTRACTS.MARKETPLACE as `0x${string}`,
        abi: MARKET_ABI,
        functionName: "cancelListing",
        args: [BigInt(tokenId)],
        account: address,
      });

      setMessage("Waiting for confirmation...");
      await waitForTransactionReceipt(wagmiConfig, { hash: txHash });

      setMessage("✅ Listing cancelled!");
      await fetchListings();
      await fetchMyNFTs();
      await fetchAllNFTs();
    } catch (err: any) {
      console.error(err);
      setMessage(`❌ ${err.message || "Cancellation failed"}`);
    } finally {
      setLoading(false);
    }
  };

  // Buy listed NFT
  const handleBuyNFT = async (tokenId: number, pricePLT: string) => {
    if (!address) return;
    setLoading(true);
    setMessage("");
    try {
      setMessage("Approving payment token...");
      await approveToken(paymentToken.address, (parseFloat(pricePLT) * 2).toString());

      setMessage("Buying NFT...");
      const txHash = await writeContract(wagmiConfig, {
        address: CONTRACTS.MARKETPLACE as `0x${string}`,
        abi: MARKET_ABI,
        functionName: "buyListedItem",
        args: [BigInt(tokenId), paymentToken.address, parseEther("0")],
        account: address,
      });

      setMessage("Waiting for confirmation...");
      await waitForTransactionReceipt(wagmiConfig, { hash: txHash });

      setMessage("✅ NFT purchased successfully!");
      await fetchListings();
      await fetchMyNFTs();
      await fetchAllNFTs();
    } catch (err: any) {
      console.error(err);
      setMessage(`❌ ${err.message || "Purchase failed"}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">🖼️ NFT Marketplace</h2>
          <p className="text-gray-400">Connect your wallet to explore NFTs</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">🖼️ Daisy NFT Collection</h1>
        <p className="text-gray-400">Mint, buy, and sell unique NFTs</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <p className="text-gray-400 text-sm mb-1">Mint Price</p>
          <p className="text-2xl font-bold">{parseFloat(nftPrice).toFixed(2)} PLT</p>
        </div>
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <p className="text-gray-400 text-sm mb-1">Total Minted</p>
          <p className="text-2xl font-bold">{totalMinted} / {maxSupply}</p>
        </div>
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <p className="text-gray-400 text-sm mb-1">Available</p>
          <p className="text-2xl font-bold">{parseInt(maxSupply) - parseInt(totalMinted)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab("mint")}
          className={`px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap ${
            activeTab === "mint" ? "bg-purple-600" : "bg-gray-800 hover:bg-gray-700"
          }`}
        >
          🎨 Mint New
        </button>
        <button
          onClick={() => setActiveTab("all-nfts")}
          className={`px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap ${
            activeTab === "all-nfts" ? "bg-purple-600" : "bg-gray-800 hover:bg-gray-700"
          }`}
        >
          🌸 All NFTs ({allNFTs.length})
        </button>
        <button
          onClick={() => setActiveTab("marketplace")}
          className={`px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap ${
            activeTab === "marketplace" ? "bg-purple-600" : "bg-gray-800 hover:bg-gray-700"
          }`}
        >
          🛒 Listed ({listings.length})
        </button>
        <button
          onClick={() => setActiveTab("my-nfts")}
          className={`px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap ${
            activeTab === "my-nfts" ? "bg-purple-600" : "bg-gray-800 hover:bg-gray-700"
          }`}
        >
          👤 My NFTs ({myNFTs.length})
        </button>
        <button
          onClick={() => setActiveTab("royalties")}
          className={`px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap ${
            activeTab === "royalties" ? "bg-purple-600" : "bg-gray-800 hover:bg-gray-700"
          }`}
        >
          💎 Royalties
        </button>
      </div>

      {/* Mint Tab */}
      {activeTab === "mint" && (
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-center">Mint New Daisy NFT</h2>
          
          <div className="bg-gray-800 rounded-lg p-6 mb-6 text-center">
            <div className="text-6xl mb-4">🌼</div>
            <p className="text-gray-400 text-sm mb-2">Next Token ID</p>
            <p className="text-3xl font-bold">#{parseInt(totalMinted) + 1}</p>
          </div>

          <div className="mb-4">
            <label className="text-sm text-gray-400 mb-2 block">Payment Token</label>
            <select
              value={paymentToken.symbol}
              onChange={(e) => setPaymentToken(TOKENS.find(t => t.symbol === e.target.value)!)}
              className="w-full bg-gray-800 px-4 py-3 rounded-lg"
            >
              {TOKENS.map((token) => (
                <option key={token.symbol} value={token.symbol}>
                  {token.icon} {token.symbol}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Price</span>
              <span className="font-semibold">{parseFloat(nftPrice).toFixed(2)} PLT</span>
            </div>
            {paymentToken.symbol !== "PLT" && (
              <p className="text-xs text-gray-500 mt-2">
                ⚠️ Will be swapped from {paymentToken.symbol} to PLT
              </p>
            )}
          </div>

          <button
            onClick={handleMintNFT}
            disabled={loading || parseInt(totalMinted) >= parseInt(maxSupply)}
            className={`w-full py-3 rounded-lg font-semibold transition ${
              loading || parseInt(totalMinted) >= parseInt(maxSupply)
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {loading ? "Minting..." : parseInt(totalMinted) >= parseInt(maxSupply) ? "Sold Out" : "Mint NFT"}
          </button>
        </div>
      )}

      {/* All NFTs Tab */}
      {activeTab === "all-nfts" && (
        <div>
          {allNFTs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">`No NFTs minted yet (wait it takes time to load).`</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {allNFTs.map((nft) => (
                <div
                  key={nft.tokenId}
                  onClick={() => setSelectedNFTId(nft.tokenId)}
                  className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden hover:border-purple-600 transition cursor-pointer"
                >
                  <div className="relative">
                    <img
                      src={nft.imageUrl}
                      alt={nft.name || `Daisy #${nft.tokenId}`}
                      className="w-full h-64 object-cover"
                    />
                    {nft.active && (
                      <div className="absolute top-2 right-2 bg-green-600 px-2 py-1 rounded text-xs font-bold">
                        LISTED
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-1">{nft.name || `Daisy #${nft.tokenId}`}</h3>
                    <p className="text-sm text-gray-400 mb-2">
                      Owner: {nft.owner?.slice(0, 6)}...{nft.owner?.slice(-4)}
                    </p>
                    {nft.active && (
                      <p className="text-purple-400 font-bold">{parseFloat(nft.pricePLT).toFixed(2)} PLT</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Marketplace Tab */}
      {activeTab === "marketplace" && (
        <div>
          {listings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No NFTs listed for sale yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((nft) => (
                <div key={nft.tokenId} className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden hover:border-purple-600 transition">
                  <img
                    src={nft.imageUrl}
                    alt={`Daisy #${nft.tokenId}`}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-2">{nft.name || `Daisy #${nft.tokenId}`}</h3>
                    {nft.description && (
                      <p className="text-sm text-gray-400 mb-2 line-clamp-2">{nft.description}</p>
                    )}
                    <p className="text-sm text-gray-400 mb-2">
                      Seller: {nft.seller.slice(0, 6)}...{nft.seller.slice(-4)}
                    </p>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-xs text-gray-400">Price</p>
                        <p className="text-xl font-bold text-purple-400">{parseFloat(nft.pricePLT).toFixed(2)} PLT</p>
                      </div>
                    </div>
                    
                    {nft.seller.toLowerCase() === address?.toLowerCase() ? (
                      <button
                        onClick={() => handleCancelListing(nft.tokenId)}
                        disabled={loading}
                        className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-lg transition"
                      >
                        Cancel Listing
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBuyNFT(nft.tokenId, nft.pricePLT)}
                        disabled={loading}
                        className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-lg transition"
                      >
                        Buy Now
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* My NFTs Tab */}
      {activeTab === "my-nfts" && (
        <div>
          {myNFTs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg mb-4">You don't own any NFTs yet</p>
              <button
                onClick={() => setActiveTab("mint")}
                className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg"
              >
                Mint Your First NFT
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myNFTs.map((nft) => (
                <div key={nft.tokenId} className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
                  <img
                    src={nft.imageUrl}
                    alt={`Daisy #${nft.tokenId}`}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-4">{nft.name || `Daisy #${nft.tokenId}`}</h3>
                    {nft.description && (
                      <p className="text-sm text-gray-400 mb-4 line-clamp-2">{nft.description}</p>
                    )}
                    
                    {selectedNFT === nft.tokenId ? (
                      <div className="space-y-3">
                        <input
                          type="number"
                          placeholder="Price in PLT"
                          value={listPrice}
                          onChange={(e) => setListPrice(e.target.value)}
                          className="w-full bg-gray-800 px-4 py-2 rounded-lg"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleListNFT(nft.tokenId)}
                            disabled={loading || !listPrice}
                            className="bg-green-600 hover:bg-green-700 py-2 rounded-lg"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => {
                              setSelectedNFT(null);
                              setListPrice("");
                            }}
                            className="bg-gray-700 hover:bg-gray-600 py-2 rounded-lg"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedNFT(nft.tokenId)}
                        disabled={loading}
                        className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-lg"
                      >
                        List for Sale
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Royalties Tab */}
      {activeTab === "royalties" && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-6">
            <h2 className="text-2xl font-bold mb-4">💎 Collection Royalties</h2>
            <p className="text-gray-400 mb-6">
              This collection has ERC2981 royalties enabled. A percentage of each secondary sale goes to the royalty receiver.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <p className="text-gray-400 text-sm mb-2">Royalty Receiver</p>
                <p className="font-mono text-lg break-all">{royaltyReceiver || "Loading..."}</p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <p className="text-gray-400 text-sm mb-2">Royalty Percentage</p>
                <p className="text-4xl font-bold text-purple-400">{royaltyPercentage}%</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-xl font-bold mb-4">How Royalties Work</h3>
            <div className="space-y-4 text-gray-300">
              <div className="flex gap-3">
                <span className="text-2xl">1️⃣</span>
                <div>
                  <p className="font-semibold mb-1">Primary Sale (Minting)</p>
                  <p className="text-sm text-gray-400">When you mint an NFT, the full price goes to the marketplace/collection owner. No royalties on primary sales.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="text-2xl">2️⃣</span>
                <div>
                  <p className="font-semibold mb-1">Secondary Sale (Resale)</p>
                  <p className="text-sm text-gray-400">
                    When an NFT is resold on the marketplace, {royaltyPercentage}% of the sale price automatically goes to the royalty receiver ({royaltyReceiver?.slice(0, 6)}...{royaltyReceiver?.slice(-4)}).
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="text-2xl">3️⃣</span>
                <div>
                  <p className="font-semibold mb-1">Marketplace Fee</p>
                  <p className="text-sm text-gray-400">The marketplace also takes a 2.5% fee on secondary sales, so the seller receives the remaining amount.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-purple-900/30 border border-purple-800 rounded-lg p-4">
              <p className="font-semibold mb-2">💡 Example:</p>
              <p className="text-sm text-gray-300">
                If an NFT sells for <span className="font-bold">100 PLT</span>:
              </p>
              <ul className="text-sm text-gray-300 mt-2 space-y-1 ml-4">
                <li>• Royalty: {royaltyPercentage} PLT ({royaltyPercentage}%)</li>
                <li>• Marketplace Fee: 2.5 PLT (2.5%)</li>
                <li>• Seller Receives: {(100 - parseFloat(royaltyPercentage) - 2.5).toFixed(2)} PLT</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* NFT Detail Modal */}
      {selectedNFTId !== null && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedNFTId(null)}
        >
          <div
            className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const nft = allNFTs.find(n => n.tokenId === selectedNFTId) || 
                          myNFTs.find(n => n.tokenId === selectedNFTId) ||
                          listings.find(n => n.tokenId === selectedNFTId);
              
              if (!nft) return null;

              const isOwner = nft.owner?.toLowerCase() === address?.toLowerCase();
              const isListed = nft.active;

              return (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                    {/* Image */}
                    <div>
                      <img
                        src={nft.imageUrl}
                        alt={nft.name || `Daisy #${nft.tokenId}`}
                        className="w-full rounded-lg"
                      />
                    </div>

                    {/* Details */}
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h2 className="text-3xl font-bold mb-2">{nft.name || `Daisy #${nft.tokenId}`}</h2>
                          <p className="text-gray-400">Token ID: #{nft.tokenId}</p>
                        </div>
                        <button
                          onClick={() => setSelectedNFTId(null)}
                          className="text-gray-400 hover:text-white text-2xl"
                        >
                          ✕
                        </button>
                      </div>

                      {nft.description && (
                        <p className="text-gray-300 mb-4">{nft.description}</p>
                      )}

                      {/* Owner */}
                      <div className="bg-gray-800 rounded-lg p-4 mb-4">
                        <p className="text-sm text-gray-400 mb-1">Owner</p>
                        <p className="font-mono">{nft.owner?.slice(0, 10)}...{nft.owner?.slice(-8)}</p>
                      </div>

                      {/* Price */}
                      {isListed && (
                        <div className="bg-purple-900/30 border border-purple-800 rounded-lg p-4 mb-4">
                          <p className="text-sm text-gray-400 mb-1">Listed Price</p>
                          <p className="text-3xl font-bold text-purple-400">{parseFloat(nft.pricePLT).toFixed(2)} PLT</p>
                        </div>
                      )}

                      {/* Attributes */}
                      {nft.attributes && nft.attributes.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-400 mb-3">Traits</p>
                          <div className="grid grid-cols-2 gap-2">
                            {nft.attributes.map((attr, idx) => (
                              <div key={idx} className="bg-gray-800 rounded-lg p-3">
                                <p className="text-xs text-gray-400">{attr.trait_type}</p>
                                <p className="font-semibold">{attr.value}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="space-y-3">
                        {isOwner && !isListed && (
                          <div>
                            <input
                              type="number"
                              placeholder="Price in PLT"
                              value={listPrice}
                              onChange={(e) => setListPrice(e.target.value)}
                              className="w-full bg-gray-800 px-4 py-2 rounded-lg mb-2"
                            />
                            <button
                              onClick={() => {
                                handleListNFT(nft.tokenId);
                                setSelectedNFTId(null);
                              }}
                              disabled={loading || !listPrice}
                              className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg font-semibold"
                            >
                              List for Sale
                            </button>
                          </div>
                        )}

                        {isOwner && isListed && (
                          <button
                            onClick={() => {
                              handleCancelListing(nft.tokenId);
                              setSelectedNFTId(null);
                            }}
                            disabled={loading}
                            className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-semibold"
                          >
                            Cancel Listing
                          </button>
                        )}

                        {!isOwner && isListed && (
                          <button
                            onClick={() => {
                              handleBuyNFT(nft.tokenId, nft.pricePLT);
                              setSelectedNFTId(null);
                            }}
                            disabled={loading}
                            className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg font-semibold"
                          >
                            Buy Now for {parseFloat(nft.pricePLT).toFixed(2)} PLT
                          </button>
                        )}

                        {!isOwner && !isListed && (
                          <div className="text-center text-gray-400 py-3">
                            This NFT is not listed for sale
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Status Message */}
      {message && (
        <div className={`fixed bottom-6 right-6 p-4 rounded-lg shadow-lg max-w-md ${
          message.includes("✅") ? "bg-green-900" : message.includes("❌") ? "bg-red-900" : "bg-blue-900"
        }`}>
          {message}
        </div>
      )}
    </div>
  );
}