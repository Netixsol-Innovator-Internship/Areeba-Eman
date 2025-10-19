"use client";

import { useAccount, useReadContract } from "wagmi";
import { useEffect } from "react";
import { PLATFORM_TOKEN_ABI, PLATFORM_TOKEN_ADDRESS } from "@/lib/constants";

export function usePlatformToken() {
  const { address } = useAccount();

  const {
    data: balance,
    refetch,
    isFetching,
  } = useReadContract({
    abi: PLATFORM_TOKEN_ABI,
    address: PLATFORM_TOKEN_ADDRESS,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  useEffect(() => {
    if (address) refetch();
  }, [address, refetch]);

  return { balance, refetch, isFetching };
}
