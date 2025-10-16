// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract MyCollection is ERC721, ERC2981, Ownable {
    using Strings for uint256;

    uint256 public maxSupply;
    uint256 public totalMinted;
    uint256 public mintPrice;
    string public baseURI;
    string public notRevealedURI;
    bool public revealed;
    bytes32 public merkleRoot;
    uint256 public maxPerWallet;

    mapping(address => uint256) public mintedPerWallet;

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 _maxSupply,
        uint256 _mintPrice,
        string memory _notRevealedURI,
        address royaltyReceiver,
        uint96 royaltyFeeNumerator // e.g., 500 = 5%
    ) ERC721(name_, symbol_) Ownable(msg.sender) {
        maxSupply = _maxSupply;
        mintPrice = _mintPrice;
        notRevealedURI = _notRevealedURI;
        maxPerWallet = 5;
        _setDefaultRoyalty(royaltyReceiver, royaltyFeeNumerator);
    }

    // ---------------- minting ----------------
    function mintPublic(uint256 quantity) external payable {
        require(quantity > 0, "quantity>0");
        require(totalMinted + quantity <= maxSupply, "sold out");
        require(msg.value >= mintPrice * quantity, "insufficient funds");
        require(
            mintedPerWallet[msg.sender] + quantity <= maxPerWallet,
            "limit per wallet"
        );
        _mintMultiple(msg.sender, quantity);
    }

    function mintWhitelist(
        uint256 quantity,
        bytes32[] calldata proof
    ) external payable {
        require(_verifyWhitelist(msg.sender, proof), "not whitelisted");
        require(quantity > 0, "quantity>0");
        require(totalMinted + quantity <= maxSupply, "sold out");
        require(msg.value >= mintPrice * quantity, "insufficient funds");
        require(
            mintedPerWallet[msg.sender] + quantity <= maxPerWallet,
            "limit per wallet"
        );
        _mintMultiple(msg.sender, quantity);
    }

    function ownerMint(address to, uint256 quantity) external onlyOwner {
        require(totalMinted + quantity <= maxSupply, "sold out");
        _mintMultiple(to, quantity);
    }

    function _mintMultiple(address to, uint256 quantity) internal {
        for (uint256 i = 0; i < quantity; i++) {
            totalMinted++;
            mintedPerWallet[to]++;
            _safeMint(to, totalMinted); // token IDs start at 1
        }
    }

    // ---------------- metadata & reveal ----------------
    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721) returns (string memory) {
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

    // ---------------- whitelist ----------------
    function setMerkleRoot(bytes32 root) external onlyOwner {
        merkleRoot = root;
    }

    function _verifyWhitelist(
        address account,
        bytes32[] calldata proof
    ) internal view returns (bool) {
        bytes32 leaf = keccak256(abi.encodePacked(account));
        return MerkleProof.verify(proof, merkleRoot, leaf);
    }

    // ---------------- royalties ----------------
    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC721, ERC2981) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function setDefaultRoyalty(
        address receiver,
        uint96 feeNumerator
    ) external onlyOwner {
        _setDefaultRoyalty(receiver, feeNumerator);
    }

    // ---------------- owner withdrawal ----------------
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "no balance");
        (bool ok, ) = payable(owner()).call{value: balance}("");
        require(ok, "withdraw failed");
    }

    // ---------------- setters ----------------
    function setMintPrice(uint256 _price) external onlyOwner {
        mintPrice = _price;
    }

    function setMaxPerWallet(uint256 _max) external onlyOwner {
        maxPerWallet = _max;
    }
}