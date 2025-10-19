interface NFT {
  id: bigint;
  name: string;
  image: string;
  price: bigint;
}

interface Props {
  nft: NFT;
  onBuy: (id: bigint, price: bigint) => void;
}

export default function NFTCard({ nft, onBuy }: Props) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-md text-center">
      <img src={nft.image} alt={nft.name} className="rounded-md mb-3" />
      <h3 className="text-lg font-bold">{nft.name}</h3>
      <p className="text-gray-400 mb-2">{Number(nft.price) / 1e18} ETH</p>
      <button
        onClick={() => onBuy(nft.id, nft.price)}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded-lg"
      >
        Buy
      </button>
    </div>
  );
}
