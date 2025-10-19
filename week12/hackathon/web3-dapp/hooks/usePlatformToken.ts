// hooks/usePlatformToken.ts
import { useAccount, useReadContract } from "wagmi";
import { PLATFORM_TOKEN_ABI, CONTRACTS } from "@/lib/constants";

export function usePlatformToken() {
  const { address } = useAccount();

  const {
    data: balance,
    isError,
    isLoading,
    refetch,
  } = useReadContract({
    abi: PLATFORM_TOKEN_ABI,
    address: CONTRACTS.PLT as `0x${string}`, // ✅ Fixed with type assertion
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  return {
    balance,
    isError,
    isLoading,
    refetch,
  };
}