// SPDX-License-Identifier: MIT
pragma solidity ^0.5.12;

import "./IERC721.sol";
import "./KittyStorage.sol";

/*
Week7 day5 we don't implement approval at the moment
*/
contract KittyContract is IERC721, KittyStorage {
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
        address indexed owner,
        uint256 indexed kittenId,
        uint256 mumId,
        uint256 dadId,
        uint256 genes,
        uint256 birthTime,
        uint256 generation
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
    function createKittyGen0(uint256 genes)
        public
        onlyOwner
        returns (uint256 newKittenId)
    {
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
    ) private returns (uint256) 
    {
        uint64 date = uint64(now);
        Kitty memory kitty = Kitty({
            genes: kittyGenes,
            birthTime: date,
            mumId: uint32(kittyMumId),
            dadId: uint32(kittyDadId),
            generation: uint16(kittyGeneration)
        });

        uint256 newKittenId = _kitties.push(kitty) - 1;

        emit birthEvent(
            kittyOwner,
            newKittenId,
            kittyMumId,
            kittyDadId,
            kittyGenes,
            date,
            kittyGeneration
        );

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
    function getKitty(uint256 kittyId)
        public
        view
        returns (
            address owner,
            uint256 genes,
            uint64 birthTime,
            uint32 mumId,
            uint32 dadId,
            uint16 generation
        )
    {
        require(_kitties.length > kittyId, "the tokenId doesn't exist yet");

        owner = _kittyIndexToOwner[kittyId]; //virer
        genes = _kitties[kittyId].genes;
        birthTime = _kitties[kittyId].birthTime;
        mumId = _kitties[kittyId].mumId;
        dadId = _kitties[kittyId].dadId;
        generation = _kitties[kittyId].generation;
    }

    /**
     * @dev Returns the list of tokenId of owner
     *
     */
    function getKittiesOf(address owner)
        external
        view
        returns (uint256[] memory)
    {
        uint256 totalOfOwner = _ownershipTokenCount[owner];
        uint256[] memory listOfKitties = new uint256[](totalOfOwner);
        uint256 counter = 0;

        for (uint256 i = 0; i < _kitties.length && counter < totalOfOwner; i++) {

            if (_kittyIndexToOwner[i] == owner) {
                listOfKitties[counter] = i;
                counter++;
            }
        }
        return listOfKitties;
    }

    /**
     * @dev Returns the number of tokens in ``owner``'s account.
     */
    function balanceOf(address owner) external view returns (uint256 balance) {
        return _ownershipTokenCount[owner];
    }

    /**
     * @dev Returns the total number of tokens in circulation.
     */
    function totalSupply() external view returns (uint256 total) {
        return _kitties.length;
    }

    /**
     * @dev Returns the name of the token.
     */
    function name() external view returns (string memory tokenName) {
        return _tokenName;
    }

    /**
     * @dev Returns the symbol of the token.
     */
    function symbol() external view returns (string memory tokenSymbol) {
        return _tokenSymbol;
    }

    /**
     * @dev Returns the owner of the `tokenId` token.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function ownerOf(uint256 tokenId) external view returns (address owner) {
        require(
            _kitties.length > tokenId,
            "No owner, the tokenId doesn't exist yet"
        );

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
    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) private {

        _ownershipTokenCount[to]++;

        _kittyIndexToOwner[tokenId] = to;

        if (from != address(0)) {
            _ownershipTokenCount[from]--;
        }

        emit transferEvent(msg.sender, to, tokenId);
    }

    /**
     * @dev helper : check if owner owns this token
     */
    function _owns(address pretender, uint256 tokenId)
        private
        view
        returns (bool isOwner)
    {
        return (_kittyIndexToOwner[tokenId] == pretender);
    }
}
