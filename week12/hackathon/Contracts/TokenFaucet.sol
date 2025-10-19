// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title TokenFaucet
 * @dev Allows users to claim free PlatformTokens every 24 hours
 */

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenFaucet is Ownable {
    IERC20 public platformToken;
    uint256 public amountPerClaim;
    uint256 public cooldown = 1 days;

    mapping(address => uint256) public lastClaim;
    mapping(address => uint256) public totalClaimed;

    event TokensClaimed(address indexed user, uint256 amount);

    constructor(address _platformToken, uint256 _amountPerClaim)
        Ownable(msg.sender)
    {
        platformToken = IERC20(_platformToken);
        amountPerClaim = _amountPerClaim;
    }

    /**
     * @notice Claim free tokens once every 24 hours
     */
    function claimTokens() external {
        require(
            block.timestamp - lastClaim[msg.sender] >= cooldown,
            "Faucet: wait 24h"
        );
        require(
            platformToken.balanceOf(address(this)) >= amountPerClaim,
            "Faucet empty"
        );

        lastClaim[msg.sender] = block.timestamp;
        totalClaimed[msg.sender] += amountPerClaim;

        platformToken.transfer(msg.sender, amountPerClaim);

        emit TokensClaimed(msg.sender, amountPerClaim);
    }

    /**
     * @return Seconds remaining until next claim
     */
    function getTimeUntilNextClaim(address user)
        external
        view
        returns (uint256)
    {
        if (block.timestamp - lastClaim[user] >= cooldown) return 0;
        return cooldown - (block.timestamp - lastClaim[user]);
    }

    /**
     * @return Total tokens the user has claimed so far
     */
    function getTotalClaimed(address user) external view returns (uint256) {
        return totalClaimed[user];
    }

    /**
     * @notice Owner can fund faucet with tokens
     */
    function fundFaucet(uint256 amount) external onlyOwner {
        platformToken.transferFrom(msg.sender, address(this), amount);
    }

    /**
     * @notice Owner can change claim amount
     */
    function setAmountPerClaim(uint256 newAmount) external onlyOwner {
        amountPerClaim = newAmount;
    }
}
