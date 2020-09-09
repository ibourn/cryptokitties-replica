// SPDX-License-Identifier: MIT
pragma solidity ^0.5.12;

/**
@dev -Allows to give access to some functions only at the owner
*/
contract Ownable {

    /**
    storage of the owner's address
    */
    address public _owner;
    
    /**
    @dev modifier : checks that sender is the owner
    */
     modifier onlyOwner(){
        require(msg.sender == _owner);
        _; 
    }
    
    /**
    @dev records the owner's address at the creation of the contract
    */
    constructor() public{
        _owner = msg.sender;
    }
    
}