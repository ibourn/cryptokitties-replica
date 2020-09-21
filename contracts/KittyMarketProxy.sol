// SPDX-License-Identifier: MIT
pragma solidity ^0.5.12;

import "./KittyMarketStorage.sol";

/**
@dev -It's the persistent connexion between users and KittyMarketContract => shouldn't be modified
*/
contract KittyMarketProxy is KittyMarketStorage{

    /***************************************************
     Variables
     **************************************************/
    /**
    address of the main contract
    */
    address _currentAddressOfKittyMarketLogic;

    /***************************************************
     Constructor
     **************************************************/
    /**
    @dev set the address of the main contract at deployment
    */
    constructor(address KittyMarketContractAddress) public {

        _currentAddressOfKittyMarketLogic = KittyMarketContractAddress;
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
        address implementation = _currentAddressOfKittyMarketLogic;
        require(_currentAddressOfKittyMarketLogic != address(0));
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
    function upgrade(address newKittyMarketContractAddress) public onlyOwner {

        _currentAddressOfKittyMarketLogic = newKittyMarketContractAddress;
    }
}