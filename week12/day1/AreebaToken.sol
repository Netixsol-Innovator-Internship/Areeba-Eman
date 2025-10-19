// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// OpenZeppelin imports (Remix supports github imports)
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.3/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.3/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.3/contracts/security/Pausable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.3/contracts/access/Ownable.sol";

/// @title AreebaToken (ERC20) — OpenZeppelin-based
contract AreebaToken is ERC20, ERC20Burnable, Pausable, Ownable {
    uint8 private immutable _decimals;

    /// @notice Constructor sets name, symbol, decimals and mints initial supply to deployer
    /// @param initialSupply The initial supply in whole tokens (not wei). e.g. pass 1000 to mint 1000 * 10**decimals
    /// @param tokenDecimals decimals (commonly 18)
    constructor(uint256 initialSupply, uint8 tokenDecimals) ERC20("Areeba Token", "ARB") {
        require(tokenDecimals <= 36, "decimals too large");
        _decimals = tokenDecimals;

        // Mint initialSupply * 10**decimals to owner (deployer)
        _mint(msg.sender, initialSupply * (10 ** uint256(_decimals)));
    }

    /// @notice decimals override
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    /// @notice Owner-only mint function (useful for controlled inflation)
    function mint(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "mint to zero");
        _mint(to, amount);
    }

    /// @notice Pause token transfers (owner only)
    function pause() external onlyOwner {
        _pause();
    }

    /// @notice Unpause token transfers (owner only)
    function unpause() external onlyOwner {
        _unpause();
    }

    /// @notice Override _beforeTokenTransfer to integrate pausable behavior
    function _beforeTokenTransfer(address from, address to, uint256 amount) internal override {
        super._beforeTokenTransfer(from, to, amount);
        require(!paused(), "token transfer while paused");
    }

    /// @notice Optional convenience: owner can rescue accidentally sent ETH
    function rescueETH(address to) external onlyOwner {
        (bool ok, ) = to.call{value: address(this).balance}("");
        require(ok, "rescue failed");
    }

    /// @notice Optional: rescue any ERC20 tokens accidentally sent to this contract
    function rescueERC20(address token, address to, uint256 amount) external onlyOwner {
        require(to != address(0), "invalid to");
        IERC20(token).transfer(to, amount);
    }

    // The remaining ERC20 functions (transfer/approve/transferFrom/balanceOf/allowance) are inherited.
}