pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract Color is ERC721Enumerable {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    string[] public colors;
    mapping(string => uint) _existingColors;
    mapping(uint => string) public idToColor;

    constructor() ERC721("ColorLife NFT", "CLFN") {}

    function awardItem( string memory _color) public returns (uint256) {
        require(_existingColors[_color]==0, "The item is already exist.");
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        colors.push(_color);
        _mint(msg.sender, newItemId);
        _existingColors[_color] = newItemId;
        idToColor[newItemId] = _color;
        return newItemId;
    }

    function transfer(address _from, address _to, uint _tokenId) public {
        _transfer(_from, _to, _tokenId);
    }

}

/* TODO 
*** 1. ownable, safeTransfer, safeMint
*** 2. set metadata/ image url/ central backend hosting
*** 3. decentral backend & oracal
*/