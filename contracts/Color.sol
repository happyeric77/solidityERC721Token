pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract Color is ERC721Enumerable {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    string[] public colors;
    mapping(string => bool) _existingColor;

    constructor() ERC721("ColorLife NFT", "CLFN") {}

    function awardItem( string memory _color) public returns (uint256) {
        require(!_existingColor[_color], "The item is already exist.");
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        colors.push(_color);
        _mint(msg.sender, newItemId);
        _existingColor[_color] = true;
        return newItemId;
    }
}

/* TODO 
*** 0. frontend + account collection.
*** 1. ownable & transfer NTF token 
*** 2. set metadata/ image url/ central backend hosting
*** 3. decentralbackend & oracal
*/