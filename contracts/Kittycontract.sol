// SPDX-License-Identifier: MIT
pragma solidity ^0.5.12;

import "./KittyToken.sol";

/** 
@dev main logic contract 
*/
contract KittyContract is KittyToken {
    /***************************************************
    Events
     **************************************************/
    /**
    @dev Emitted when `kittenId` is created
     */
    event Birth(
        address indexed owner,
        uint256 indexed kittenId,
        uint256 mumId,
        uint256 dadId,
        uint256 genes,
        uint256 birthTime,
        uint256 generation
    );

    /***************************************************
    External Functions
     **************************************************/
    /**
    @dev Returns the list of tokenId of the owner
     */
    function getKittiesOf(address owner)
        external
        view
        returns (uint256[] memory)
    {
        uint256 totalOfOwner = _ownershipTokenCount[owner];
        uint256[] memory listOfKitties = new uint256[](totalOfOwner);
        uint256 counter = 0;

        for (
            uint256 i = 0;
            i < _kitties.length && counter < totalOfOwner;
            i++
        ) {
            if (_kittyIndexToOwner[i] == owner) {
                listOfKitties[counter] = i;
                counter++;
            }
        }
        return listOfKitties;
    }

    /***************************************************
    Public Functions
     **************************************************/
    /**
    @dev Returns informations about `kittyId`. 
    Requirements: 
    - `kittyId` must exist.
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
    @dev creates a kitty : generation 0 
    - uses private function : _createKitty
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
    @dev creates a kitty by breeding :
    - sender must be the owner
    - no breeding between direct parents and siblings
    */
    function breed(uint256 dadId, uint256 mumId) public returns (uint256) {
        require(
            dadId < _kitties.length && mumId < _kitties.length,
            "one of the parents doesn't exist"
        );
        require(
            _owns(msg.sender, dadId) || _owns(msg.sender, mumId),
            "sender needs to be the owner"
        );
        require(dadId != mumId, "dad can't be mum!");
        require(
            _areNotParent(dadId, mumId) && _areNotSibling(dadId, mumId),
            "no breeding between direct parents or siblings"
        );

        uint256 dadDna = _kitties[dadId].genes;
        uint256 mumDna = _kitties[mumId].genes;
        uint256 dadGeneration = _kitties[dadId].generation;
        uint256 mumGeneration = _kitties[mumId].generation;

        uint256 generation = 1 +
            (dadGeneration > mumGeneration ? dadGeneration : mumGeneration);

        uint256 kittenDna = _mixDna(dadDna, mumDna);

        _createKitty(mumId, dadId, generation, kittenDna, msg.sender);
    }

    /***************************************************
    Private Functions
     **************************************************/
     /** 
     @dev mix dna from dad and mum
     */
    function _mixDna(uint256 dadDna, uint256 mumDna)
        private
        pure
        returns (uint256)
    {
        uint256 firsthalf = dadDna / 100000000;
        uint256 secondhalf = mumDna % 100000000;

        return (firsthalf * 100000000) + secondhalf;
    }

     /** 
     @dev checks that the kitties are not direct parents
     */
    function _areNotParent(uint256 firstId, uint256 secondId)
        private
        view
        returns (bool)
    {
        uint256 genFirstId = _kitties[firstId].generation;
        uint256 genSecondId = _kitties[secondId].generation;

        if (genSecondId == genFirstId + 1) {

            return (firstId != _kitties[secondId].dadId &&
                firstId != _kitties[secondId].mumId);

        } else if (genFirstId == genSecondId + 1) {
            
            return (secondId != _kitties[firstId].dadId &&
                secondId != _kitties[firstId].mumId);
        } else {
            return true;
        }
    }

     /** 
     @dev checks that the kitties are not siblings
     */
    function _areNotSibling(uint256 firstId, uint256 secondId)
        private
        view
        returns (bool)
    {
        uint256 dadFirstId = _kitties[firstId].dadId;
        uint256 mumFirstId = _kitties[firstId].mumId;
        uint256 dadSecondId = _kitties[secondId].dadId;
        uint256 mumSecondId = _kitties[secondId].mumId;

        return ((dadFirstId != dadSecondId &&
            dadFirstId != mumSecondId &&
            mumFirstId != dadSecondId &&
            mumFirstId != mumSecondId) ||
            (_kitties[firstId].generation + _kitties[secondId].generation ==
                0));
    }

    /**
    @dev general function for the creation of new kitten
     */
    function _createKitty(
        uint256 kittyMumId,
        uint256 kittyDadId,
        uint256 kittyGeneration,
        uint256 kittyGenes,
        address kittyOwner
    ) private returns (uint256) {
        uint64 date = uint64(now);
        Kitty memory kitty = Kitty({
            genes: kittyGenes,
            birthTime: date,
            mumId: uint32(kittyMumId),
            dadId: uint32(kittyDadId),
            generation: uint16(kittyGeneration)
        });

        uint256 newKittenId = _kitties.push(kitty) - 1;

        emit Birth(
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
}
