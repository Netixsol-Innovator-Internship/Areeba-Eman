// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MultiTokenDEX
 * @dev Multi-token DEX without LP tokens. Supports multi-user pools, add/remove liquidity, swaps with slippage.
 */

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MultiTokenDEX is Ownable, ReentrancyGuard {
    constructor() Ownable(msg.sender) {}

    uint256 public feeBasis = 3; // 0.3% fee

    struct Pool {
        uint256 reserveA;
        uint256 reserveB;
        bool exists;
        mapping(address => uint256) userContributionA;
        mapping(address => uint256) userContributionB;
    }

    // pairKey = keccak256(tokenA, tokenB)
    mapping(bytes32 => Pool) private pools;

    event LiquidityAdded(address indexed tokenA, address indexed tokenB, address indexed user, uint256 amountA, uint256 amountB);
    event LiquidityRemoved(address indexed tokenA, address indexed tokenB, address indexed user, uint256 amountA, uint256 amountB);
    event Swap(address indexed fromToken, address indexed toToken, address indexed user, uint256 amountIn, uint256 amountOut);

    // ---------- Helper functions ----------
    function _getPairKey(address tokenA, address tokenB) internal pure returns (bytes32) {
        return tokenA < tokenB ? keccak256(abi.encodePacked(tokenA, tokenB)) : keccak256(abi.encodePacked(tokenB, tokenA));
    }

    function _sortTokens(address tokenA, address tokenB) internal pure returns (address, address) {
        return tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
    }

    // ---------- Liquidity ----------
    function addLiquidity(address tokenA, address tokenB, uint256 amountA, uint256 amountB) external nonReentrant {
        require(amountA > 0 && amountB > 0, "Amounts must be >0");

        (address t0, ) = _sortTokens(tokenA, tokenB);
        bytes32 key = _getPairKey(tokenA, tokenB);
        Pool storage pool = pools[key];

        // Transfer tokens in
        IERC20(tokenA).transferFrom(msg.sender, address(this), amountA);
        IERC20(tokenB).transferFrom(msg.sender, address(this), amountB);

        // Update pool reserves
        pool.reserveA += amountA;
        pool.reserveB += amountB;
        pool.exists = true;

        // Update user contributions
        if (tokenA == t0) {
            pool.userContributionA[msg.sender] += amountA;
            pool.userContributionB[msg.sender] += amountB;
        } else {
            pool.userContributionA[msg.sender] += amountB;
            pool.userContributionB[msg.sender] += amountA;
        }

        emit LiquidityAdded(tokenA, tokenB, msg.sender, amountA, amountB);
    }

    function removeLiquidity(address tokenA, address tokenB, uint256 sharePercentageBasisPoints) external nonReentrant {
        require(sharePercentageBasisPoints > 0 && sharePercentageBasisPoints <= 10000, "Share must be 0-10000 (bps)");

        (address t0, ) = _sortTokens(tokenA, tokenB);
        bytes32 key = _getPairKey(tokenA, tokenB);
        Pool storage pool = pools[key];
        require(pool.exists, "Pool does not exist");

        uint256 userA = pool.userContributionA[msg.sender];
        uint256 userB = pool.userContributionB[msg.sender];
        require(userA > 0 && userB > 0, "No contribution");

        uint256 amountA = (userA * sharePercentageBasisPoints) / 10000;
        uint256 amountB = (userB * sharePercentageBasisPoints) / 10000;

        // Update pool reserves
        if (tokenA == t0) {
            pool.reserveA -= amountA;
            pool.reserveB -= amountB;
        } else {
            pool.reserveA -= amountB;
            pool.reserveB -= amountA;
        }

        // Update user contributions
        pool.userContributionA[msg.sender] -= amountA;
        pool.userContributionB[msg.sender] -= amountB;

        // Transfer tokens back to user
        IERC20(tokenA).transfer(msg.sender, amountA);
        IERC20(tokenB).transfer(msg.sender, amountB);

        emit LiquidityRemoved(tokenA, tokenB, msg.sender, amountA, amountB);
    }

    // ---------- Swap ----------
    function getAmountOut(uint256 amountIn, uint256 reserveIn, uint256 reserveOut) public pure returns (uint256) {
        require(amountIn > 0, "Amount in = 0");
        require(reserveIn > 0 && reserveOut > 0, "Insufficient liquidity");
        uint256 amountInWithFee = amountIn * 997 / 1000; // 0.3% fee
        uint256 numerator = amountInWithFee * reserveOut;
        uint256 denominator = reserveIn + amountInWithFee;
        return numerator / denominator;
    }

    function swap(address fromToken, address toToken, uint256 amountIn, uint256 minAmountOut) external nonReentrant returns (uint256 amountOut) {
        require(amountIn > 0, "AmountIn = 0");

        (address t0, ) = _sortTokens(fromToken, toToken);
        bytes32 key = _getPairKey(fromToken, toToken);
        Pool storage pool = pools[key];
        require(pool.exists, "Pool does not exist");

        uint256 reserveIn = fromToken == t0 ? pool.reserveA : pool.reserveB;
        uint256 reserveOut = fromToken == t0 ? pool.reserveB : pool.reserveA;

        amountOut = getAmountOut(amountIn, reserveIn, reserveOut);
        require(amountOut >= minAmountOut, "Slippage too high");

        // Transfer in and out
        IERC20(fromToken).transferFrom(msg.sender, address(this), amountIn);
        IERC20(toToken).transfer(msg.sender, amountOut);

        // Update reserves
        if (fromToken == t0) {
            pool.reserveA += amountIn;
            pool.reserveB -= amountOut;
        } else {
            pool.reserveA -= amountOut;
            pool.reserveB += amountIn;
        }

        emit Swap(fromToken, toToken, msg.sender, amountIn, amountOut);
    }

    // ---------- Views ----------
    function getReserves(address tokenA, address tokenB) external view returns (uint256 reserveA, uint256 reserveB) {
        bytes32 key = _getPairKey(tokenA, tokenB);
        Pool storage pool = pools[key];
        require(pool.exists, "Pool does not exist");
        (address t0, ) = _sortTokens(tokenA, tokenB);
        if (tokenA == t0) return (pool.reserveA, pool.reserveB);
        else return (pool.reserveB, pool.reserveA);
    }

    function previewSwap(address fromToken, address toToken, uint256 amountIn) external view returns (uint256) {
        bytes32 key = _getPairKey(fromToken, toToken);
        Pool storage pool = pools[key];
        require(pool.exists, "Pool does not exist");

        (address t0, ) = _sortTokens(fromToken, toToken);
        uint256 reserveIn = fromToken == t0 ? pool.reserveA : pool.reserveB;
        uint256 reserveOut = fromToken == t0 ? pool.reserveB : pool.reserveA;
        return getAmountOut(amountIn, reserveIn, reserveOut);
    }

    function getUserContribution(address tokenA, address tokenB, address user) external view returns (uint256 amountA, uint256 amountB) {
        bytes32 key = _getPairKey(tokenA, tokenB);
        Pool storage pool = pools[key];
        require(pool.exists, "Pool does not exist");

        amountA = pool.userContributionA[user];
        amountB = pool.userContributionB[user];
    }

    // ---------- Admin ----------
    function setFee(uint256 newFeeBasis) external onlyOwner {
        require(newFeeBasis <= 50, "Fee too high"); // max 5%
        feeBasis = newFeeBasis;
    }
}
