// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

import "./KittyContract.sol";
import "./KittyRentalFactory.sol";
import "./Ownable.sol";
import "./Pausable.sol";


/**
-Allows persistent storage => shouldn't be modified

-Inherits from Ownable and Pausable cause the scope of the fallback function in KittyMarketProxy
will be the proxy context which means the real persistent storage is inside the parent of KittyMarketProxy
 */
contract KittyMarketStorage is Ownable, Pausable {

    KittyContract internal _kittyContract;
    KittyRentalFactory internal _kittyRentalFactory;

    struct Offer {
        address payable seller;
        uint256 price;
        uint256 index;
        uint256 tokenId;
        bool active;
    }

    Offer[] internal _offers;
    address[] internal _rentalOffers;

    mapping(uint256 => Offer) internal _tokenIdToOffer;
    mapping(address => uint256) internal _accountToBalance;
}