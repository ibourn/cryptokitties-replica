// SPDX-License-Identifier: MIT
pragma solidity ^0.5.12;

import "./KittyStorage.sol";

/**
@dev -It's the persistent connexion between users and KittyContract => shouldn't be modified
*/
contract KittyProxy is KittyStorage{

    /***************************************************
     Variables
     **************************************************/
    /**
    address of the main contract
    */
    address _currentAddressOfKittyLogic;

    /***************************************************
     Constructor
     **************************************************/
    /**
    @dev set the address of the main contract at deployment
    */
    constructor(address KittyContractAddress) public {

        _currentAddressOfKittyLogic = KittyContractAddress;
    }

    /***************************************************
     Functions
     **************************************************/
    /**
    @dev fallback function (=default function triggered when we call a function that is not there
    
    -forwards function calls to the main contract with the proxy context (KittyStorage : its parent)
    */
    function() payable external {

        //redirection to _currentAddressOfKittyLogic
        address implementation = _currentAddressOfKittyLogic;
        require(_currentAddressOfKittyLogic != address(0));
        bytes memory data = msg.data;

        //assembly code : gives a pointer to the contract function, if operation failed (result = 0) => revert
        assembly {
            let result := delegatecall(gas, implementation, add(data, 0x20), mload(data), 0 ,0)

            let size := returndatasize

            let ptr := mload(0x40)
            returndatacopy(ptr, 0, size)
            switch result
            case 0 {revert(ptr, size)}
            default {return(ptr, size)}
        }
    }

    /**
    @dev updates the address of the main contract
    */
    function upgrade(address newKittyContractAddress) public onlyOwner {

        _currentAddressOfKittyLogic = newKittyContractAddress;
    }
}