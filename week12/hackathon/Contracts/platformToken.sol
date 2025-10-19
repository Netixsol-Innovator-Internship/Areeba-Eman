// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PlatformToken
 * @dev ERC20 token that can be minted by the owner (for faucet, rewards, etc.)
 */

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PlatformToken is ERC20, Ownable {
    /**
     * @param initialSupply Initial supply (in wei, e.g. 1_000_000 * 10**18)
     */
    constructor(uint256 initialSupply)
        ERC20("PlatformToken", "PLT")
        Ownable(msg.sender)
    {
        _mint(msg.sender, initialSupply);
    }

    /**
     * @notice Mint new tokens — faucet or future features will call this
     * @param to Recipient address
     * @param amount Amount to mint (in wei)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
