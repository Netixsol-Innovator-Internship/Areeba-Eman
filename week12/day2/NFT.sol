// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";

contract MyNFT is ERC721URIStorage, Ownable, ERC2981 {
    uint256 public mintPrice;
    uint256 public maxSupply;
    uint256 public nextTokenId = 1;

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 _maxSupply,
        uint256 _mintPrice,
        address royaltyReceiver,
        uint96 royaltyFee // e.g. 500 = 5%
    ) ERC721(name_, symbol_) Ownable(msg.sender) {
        maxSupply = _maxSupply;
        mintPrice = _mintPrice;
        _setDefaultRoyalty(royaltyReceiver, royaltyFee);
    }

    // -------- Mint --------
    function mint(string memory tokenURI_) external payable {
        require(nextTokenId <= maxSupply, "All minted");
        require(msg.value >= mintPrice, "Not enough ETH");

        uint256 tokenId = nextTokenId;
        nextTokenId++;

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI_);
    }

    // -------- Owner mint (no cost) --------
    function ownerMint(address to, string memory tokenURI_) external onlyOwner {
        require(nextTokenId <= maxSupply, "All minted");

        uint256 tokenId = nextTokenId;
        nextTokenId++;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI_);
    }

    // -------- Withdraw --------
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // -------- Overrides --------
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorage, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
