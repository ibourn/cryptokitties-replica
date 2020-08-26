// SPDX-License-Identifier: MIT
pragma solidity ^0.5.12;

import "./IERC721.sol";
import "./Ownable.sol";

/*
Week7 day5 we don't implement approval at the moment
*/
contract Kittycontract is IERC721, Ownable {

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
    uint256 private constant _CREATION_LIMIT_GEN0 = 10;
    uint256 public _gen0Counter;
    string private constant _tokenName = "BootcampKitties";
    string private constant _tokenSymbol= "BKT";


    /***************************************************
     * Mappings and Arrays
     **************************************************/
    Kitty[] private _kitties;

    mapping (uint256 => address) public _kittyIndexToOwner;
    mapping (address => uint256) _ownershipTokenCount;


    /***************************************************
     * Events
     **************************************************/
    /**
     * @dev Emitted when `tokenId` token is transfered from `from` to `to`.
     */
    event transferEvent(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId
   );
    /**
     * @dev Emitted when `kittenId` is created
     */
    event birthEvent(
        address owner,
        uint256 kittenId,
        uint256 mumId,
        uint256 dadId,
        uint256 genes
    );
    // /**
    //  * @dev Emitted when `owner` enables `approved` to manage the `tokenId` token.
    //  */
    // event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);


    /***************************************************
     * Functions
     **************************************************/
    /**
     * @dev creates a kitty : generation 0 
     *
     * - uses private function : _createKitty
     */
    function createKittyGen0(uint256 genes) public onlyOwner returns(uint256 newKittenId) {
        require(_gen0Counter < _CREATION_LIMIT_GEN0);

        _gen0Counter++;

        //Gen0 have no owners they are own by the contract address(this)
        return _createKitty(0, 0, 0, genes, msg.sender);
    }

    /**
     * @dev general function for the creation of new kitten
     */
    function _createKitty(
        uint256 kittyMumId,
        uint256 kittyDadId,
        uint256 kittyGeneration,
        uint256 kittyGenes,
        address kittyOwner
    ) private returns (uint256) {

        Kitty memory kitty = Kitty({
            genes: kittyGenes,
            birthTime: uint64(now),
            mumId: uint32(kittyMumId),
            dadId: uint32(kittyDadId),
            generation: uint16(kittyGeneration)
        });

        uint256 newKittenId = _kitties.push(kitty) - 1;

        emit birthEvent(kittyOwner, newKittenId, kittyMumId, kittyDadId, kittyGenes);

        _transfer(address(0), kittyOwner, newKittenId);

        return newKittenId;
    }

    /**
     * @dev Returns informations about `kittyId`.
     *
     * Requirements:
     *
     * - `kittyId` must exist.
     */
    function getKitty(uint256 kittyId) public view returns(
        address owner,
        uint256 genes,
        uint256 birthTime,
        uint256 mumId,
        uint256 dadId,
        uint256 generation
     ) {
        require(_kitties.length > kittyId, "the tokenId doesn't exist yet");

        Kitty storage kitty = _kitties[kittyId];

        owner = _kittyIndexToOwner[kittyId];
        genes = _kitties[kittyId].genes;
        birthTime = uint256(_kitties[kittyId].birthTime);
        mumId = uint256(_kitties[kittyId].mumId);
        dadId = uint256(_kitties[kittyId].dadId);
        generation = uint256(_kitties[kittyId].generation);
    }

    /**
     * @dev Returns the number of tokens in ``owner``'s account.
     */
    function balanceOf(address owner) external view returns(uint256 balance){
        return _ownershipTokenCount[owner];
    }

    /**
     * @dev Returns the total number of tokens in circulation.
     */
    function totalSupply() external view returns (uint256 total){
        return _kitties.length;
    }

    /**
     * @dev Returns the name of the token.
     */
    function name() external view returns (string memory tokenName){
        return _tokenName;
    }
    
    /**
     * @dev Returns the symbol of the token.
     */
    function symbol() external view returns (string memory tokenSymbol){
        return _tokenSymbol;
    }
        
    /**
     * @dev Returns the owner of the `tokenId` token.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function ownerOf(uint256 tokenId) external view returns (address owner){
        require(_kitties.length > tokenId, "No owner, the tokenId doesn't exist yet");

        return _kittyIndexToOwner[tokenId];
    }

     /** @dev Transfers `tokenId` token from `msg.sender` to `to`.
     * - call _transfer(from, to , tokenId)
     *
     * Requirements:
     *
     * - `to` cannot be the zero address.
     * - `to` can not be the contract address.
     * - `tokenId` token must be owned by `msg.sender`.
     *
     */
    function transfer(address to, uint256 tokenId) external {
        require(to != address(0), "query transfer to 0 address");
        require(to != address(this), "query transfer to contract address");
        require(_owns(msg.sender, tokenId), "sender is not the token owner");

        _transfer(msg.sender, to, tokenId);
    }

     /** @dev Transfer : main function
     *
     * Emits a {Transfer} event.
     */
    function _transfer(address from, address to, uint256 tokenId) private {
        _ownershipTokenCount[to]++;

        _kittyIndexToOwner[tokenId] = to;

        if(from != address(0)){
            _ownershipTokenCount[from]--;
        }

        emit transferEvent(msg.sender, to, tokenId);
    }   

    /**
     * @dev helper : check if owner owns this token
     */
     function _owns(address pretender, uint256 tokenId) private view returns(bool isOwner) {
         return (_kittyIndexToOwner[tokenId] == pretender);
     }

}