// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;


contract IKittyRental {
/**
*@dev open a contract for a supplier
* - set the supplier's address and address of KittyContract
*/
  function initialize(address supplier, address kittyContractAddress) public;

/**
*@dev set the address of KittyContract
*/
    function setKittyContract(address kittyContractAddress) public;

/**
*@dev return the offer for tokenId if still active
*/
function getRentalOffer(uint256 token)public view returns(
     uint256 tokenId,
        uint256 actionsRemaining,
        uint256 price,
        uint256 endTime,
        uint256 index,
             address borrower,
             address supplier

);

/**
*@dev return the number of token on rent
*/
function getTotalOnRent() public returns(uint256);

/**
*@dev return the number of token available for borrower
*/
function getTotalOfBorrower(address borrower) public returns(uint256);

/**
*@dev return all tokenId on rent
*/
function getAllTokenOnRent() public view returns(uint256[] memory listOfTokens);

/**
*@dev return the tokenId availbale for 'borrower'
*/
function getAvalaibleTokensOf(address borrower)public returns(uint256[] memory listOfTokens);

/**
*@dev set an offer
* - MarketPlaces or contracts suppliers have to checks that the token isn't on sale
* to prevent a rental offer or notify borrowers.
* - It must give approval to the contract address before to call it
* - an accepted offer must always be completed
*/
    function setRentalOffer(address from, uint256 tokenId, uint256 numberOfUse, uint256 price) public;

/**
*@dev accept an offer
* - requirements : msg.value == price
* - set the params to let the borrower use the token
* - add msg.value to the supplier's balance
*/
    function takeRentalOffer(uint256 tokenId, address borrower) payable public;

/**
*@dev close an offer
* - requirements : offer is completed or not accepted yet
*/
function closeRentalOffer(uint256 tokenId) public;



//need contract to be approved before (FE) by lender
/**
*@dev allows the borrower to exercise his right 
* - requirements :
* - dadId is the rented token / borrower should own mumId 
* - Contract needs to get approved BEFFORE (for mumId)
* - steps : breed / transfer kitten to borrower / release approval for mumId
* - if it's the last action allowed : close the offer / transfer price from 
* frozen balance to supplier's balance
* - if the supplier sold the token before the end of the contract,
* approvals are lost, so the contract is broken : refund the borrower 
* (even if he began to consume the offer)
*/
function consumeAction(uint256 dadRentedId, uint256 mumBorrowerId) public;

/**
*@dev checks if offer is still availbale (not taken and not cancelled)
*/
function isActive(uint256 tokenId) public view returns(bool);

/**
*@dev checks if offer is still valid (offer is taken and not ended)
*/
function isStillValid(uint256 tokenId) public view returns(bool);


/**
*@dev refunds the borrower is contract is broken
*/
function refund(address borrower, uint256 price) private;

/**
*@dev allows the supplier to withdraw his reward
*/
function withdraw() public ;
}






