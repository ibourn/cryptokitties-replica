pragma solidity ^0.5.12;

import "./Pausable.sol";
import "./Ownable.sol";


/**
* -Allows persistent storage => shouldn't be modified
*
* -Inherits from Ownable and Pausable cause the scope of the fallback function in KittyProxy
* will be the proxy context which means the real persistent storage is inside the parent of KittyProxy
*
 */
contract KittyStorage is Ownable, Pausable{

    /**
     * Struct of a kitty
     */
    struct Kitty{
        uint256 genes;
        uint64 birthTime;
        uint32 mumId;
        uint32 dadId;
        uint16 generation;
    }

    /***************************************************
     * Variables
     **************************************************/
    uint256 internal constant _CREATION_LIMIT_GEN0 = 10;
    uint256 public _gen0Counter;
    string internal constant _tokenName = "BootcampKitties";
    string internal constant _tokenSymbol= "BKT";


    /***************************************************
     * Mappings and Arrays
     **************************************************/
    Kitty[] internal _kitties;

    mapping (uint256 => address) public _kittyIndexToOwner;
    mapping (address => uint256) _ownershipTokenCount;

}