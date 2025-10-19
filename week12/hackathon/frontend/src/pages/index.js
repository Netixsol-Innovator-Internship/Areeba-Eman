import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Home() {
  const { address, isConnected } = useAccount();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <ConnectButton />
      {isConnected && (
        <p className="mt-4 text-gray-800">
          Connected as <strong>{address}</strong>
        </p>
      )}
    </div>
  );
}
