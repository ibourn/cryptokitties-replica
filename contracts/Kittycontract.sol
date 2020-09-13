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
        // require(
        //     _areNotParent(dadId, mumId) && _areNotSibling(dadId, mumId),
        //     "no breeding between direct parents or siblings"
        // );
        require(
            _areNotParent(dadId, mumId),
            "no breeding between direct parents or siblings"
        );

        (, uint256 dadDna, , , , uint256 dadGeneration) = getKitty(dadId);
        (, uint256 mumDna, , , , uint256 mumGeneration) = getKitty(mumId);

        uint256 generation = 1 +
            (dadGeneration > mumGeneration ? dadGeneration : mumGeneration);

        uint256 kittenDna = _mixDna(dadDna, mumDna);

        _createKitty(mumId, dadId, generation, kittenDna, msg.sender);
    }

    /***************************************************
    Private Functions
     **************************************************/
    /** 
     @dev mix dna from dad and mum with pseudo randomness :

    - 'gene' : 16 digits => 8 pairs (2 digits each) 
    - as 'gene' represents 10 effects (11 22 33 44 5 5 66 77 8 8) some are expressed
    with one digit others with 2
    Not cutting the digits the same way the effects are represented is a first step of randomness.

    NEXT STEPS :
    - get a pseudo random number : now mod 255 => 0-255 = 8 bit digits (ex: 01010101)
    - we take the value of the position of one bit = 1 in uint8 (0-255)
    00000001 =1 // 00000010 =2 // 00000100 =4... 1000000 =128
    these bits represent the position of one pair.
    - we do & operation on the random number to know if we choose mum's or dad's pair
    bit = 1 for mum's pair, 0 for the dad's pair, ex :
    10111010 & 00000010 = 1 : the 7th pair will get the value 1 so it will be the mum's pair
    - we fill the geneArray by the end so that we can do parentDna % 100 to get the last pair
    then parentDna = parentDna / 100 to eliminate this step
    -Finally we build the new 'gene' by moving each pair added by two digits to the left (*100)

    EXTRA RANDOMNESS : one pair will be random (neither from the dad or from the mum)
    - we take now mod 8 to get the position of this pair
    - Finally to get the value of the pair pseudo randomly: 
    D = now mod 10 , U = block.number mod 10, C = block.difficulty mod 100
    joker pair = (((D*10) + U) + C) / 2
     */
    function _mixDna(uint256 dadDna, uint256 mumDna)
        private
        pure
        returns (uint256)
    {
        uint256[8] memory geneArray;
        uint256 newGene;
        uint256 index = 7;
        uint256 i = 1;
        uint256 jokerIndex = now % 8;
        uint8 joker = uint8(
            ((now % 10) * 10) + (block.number % 10) + (block.difficulty % 100)
        ) / 2;
        uint8 random = uint8(now % 255);

        for (i = 1; i < 128; i = i * 2) {
            if (index != jokerIndex) {
                if (random & i != 0) {
                    geneArray[index] = uint8(mumDna % 100);
                } else {
                    geneArray[index] = uint8(dadDna % 100);
                }
            } else {
                geneArray[index] = joker;
            }
            mumDna = mumDna / 100;
            dadDna = dadDna / 100;

            index--;
        }

        for (i = 0; i < 8; i++) {
            newGene = newgene + geneArray[i];
            if (i != 7) {
                newgene = newGene * 100;
            }
        }
        return newGene;
    }

    /** 
     @dev checks that the kitties are not direct parents or siblings
     */
    function _areNotParent(uint256 firstId, uint256 secondId)
        private
        view
        returns (bool)
    {
        (
            ,
            ,
            ,
            uint256 mumFirstId,
            uint256 dadFirstId,
            uint256 genFirstId
        ) = getKitty(firstId);
        (
            ,
            ,
            ,
            uint256 mumSecondId,
            uint256 dadSecondId,
            uint256 genSecondId
        ) = getKitty(secondId);

        // uint256 genFirstId = _kitties[firstId].generation;
        // uint256 genSecondId = _kitties[secondId].generation;

        if (genSecondId == genFirstId + 1) {
            return (firstId != dadSecondId && firstId != mumSecondId);
        } else if (genFirstId == genSecondId + 1) {
            return (secondId != dadFirstId && secondId != mumFirstId);
        } else {
            return ((dadFirstId != dadSecondId &&
                dadFirstId != mumSecondId &&
                mumFirstId != dadSecondId &&
                mumFirstId != mumSecondId) || (genFirstId + genSecondId == 0));
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
        // require(_kitties[kittyDadId].coolDownIndex < 10);
        // require(_kitties[kittyDadId].coolDownEnding == 0 ||
        // _kitties[kittyDadId].coolDownEnding <= block.number);
        // require(_kitties[kittyMumId].coolDownIndex < 10);
        // require(_kitties[kittyMumId].coolDownEnding == 0 ||
        // _kitties[kittyMumId].coolDownEnding <= block.number);

        uint64 date = uint64(block.timestamp); // uint64(now);
        Kitty memory kitty = Kitty({
            genes: // coolDownEnding: 0,
            kittyGenes,
            birthTime: date,
            mumId: uint32(kittyMumId),
            dadId: uint32(kittyDadId),
            generation: uint16(kittyGeneration)
            // coolDownIndex: 0
        });

        uint256 newKittenId = _kitties.push(kitty) - 1;

        // _kitties[kittyDadId].coolDownEnding = block.number + (_kitties[kittyDadId].generation * _coolDownPeriod[_kitties[kittyDadId].coolDownIndex]);
        // _kitties[kittyDadId].coolDownIndex++;
        // _kitties[kittyMumId].coolDownEnding = block.number + (_kitties[kittyMumId].generation * _coolDownPeriod[_kitties[kittyMumId].coolDownIndex]);
        // _kitties[kittyMumId].coolDownIndex++;

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
