import { ethers } from "ethers";

export const SIMPLE_SWAP_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
export const TOKEN_A_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_A;
export const TOKEN_B_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_B;

export const SIMPLE_SWAP_ABI = [
  "function addLiquidity(uint256 amountA, uint256 amountB) external",
  "function swapAforB(uint256 amountAIn) external",
  "function swapBforA(uint256 amountBIn) external",
  "function getReserves() external view returns (uint256,uint256)",
  "function getSwapAmount(uint256 amountIn, bool swapAforB) external view returns (uint256)"
];

export const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  "function transfer(address to, uint256 amount) external returns (bool)",
];
