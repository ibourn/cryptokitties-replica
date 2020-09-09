// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;


/**
@dev interface to checks if the receiver contract supports ERC721 
- used by _checkERC721Support
*/
interface IERC721Receiver {

    function onERC721Received(address operator, address from, uint tokenId, bytes calldata data) external returns(bytes4);
}