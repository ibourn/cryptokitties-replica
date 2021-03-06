// SPDX-License-Identifier: MIT
pragma solidity ^0.5.12;

import "./Pausable.sol";
import "./Ownable.sol";


/**
-Allows persistent storage => shouldn't be modified

-Inherits from Ownable and Pausable cause the scope of the fallback function in KittyProxy
will be the proxy context which means the real persistent storage is inside the parent of KittyProxy
 */
contract KittyStorage is Ownable, Pausable{

    /**
      Struct of a kitty
     */
    struct Kitty{
        // uint256 coolDownEnding;
        uint256 genes;
        uint64 birthTime;
        uint32 mumId;
        uint32 dadId;
        uint16 generation;
        // uint8 coolDownIndex;
    }

    /***************************************************
     Variables
     **************************************************/
    uint256 internal constant _CREATION_LIMIT_GEN0 = 10;
    uint256 internal _gen0Counter;
    // uint256 internal constant _coolDownPeriod = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
    string internal constant _TOKENNAME = "BootcampKitties";
    string internal constant _TOKENSYMBOL= "BKT";

    bytes4 internal constant _MAGIC_ERC721_RECEIVED = bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));

    /*
     *     bytes4(keccak256('balanceOf(address)')) == 0x70a08231
     *     bytes4(keccak256('ownerOf(uint256)')) == 0x6352211e
     *     bytes4(keccak256('approve(address,uint256)')) == 0x095ea7b3
     *     bytes4(keccak256('getApproved(uint256)')) == 0x081812fc
     *     bytes4(keccak256('setApprovalForAll(address,bool)')) == 0xa22cb465
     *     bytes4(keccak256('isApprovedForAll(address,address)')) == 0xe985e9c5
     *     bytes4(keccak256('transferFrom(address,address,uint256)')) == 0x23b872dd
     *     bytes4(keccak256('safeTransferFrom(address,address,uint256)')) == 0x42842e0e
     *     bytes4(keccak256('safeTransferFrom(address,address,uint256,bytes)')) == 0xb88d4fde
     *
     *     => 0x70a08231 ^ 0x6352211e ^ 0x095ea7b3 ^ 0x081812fc ^
     *        0xa22cb465 ^ 0xe985e9c5 ^ 0x23b872dd ^ 0x42842e0e ^ 0xb88d4fde == 0x80ac58cd
     */
    bytes4 internal constant _INTERFACE_ID_ERC721 = 0x80ac58cd;
    /*
     * bytes4(keccak256('supportsInterface(bytes4)')) == 0x01ffc9a7
     */
    bytes4 internal constant _INTERFACE_ID_ERC165 = 0x01ffc9a7;
    
    /***************************************************
     Mappings and Arrays
     **************************************************/
    Kitty[] internal _kitties;

    mapping (uint256 => address) internal _kittyIndexToOwner;
    mapping (address => uint256) internal _ownershipTokenCount;

    mapping (uint256 => address) internal _kittyIndexToApproved;
    mapping (address => mapping (address => bool)) internal _operatorApprovals;

}