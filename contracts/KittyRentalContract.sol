// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

import "./KittyContract.sol";
import './IKittyRental.sol';


contract KittyRentalContract is IKittyRental {

KittyContract internal _kittyContract;
    uint256 constant _duration = 1 days;
    uint256 _frozenBalance;
    uint256 _supplierBalance;
    address _supplier;//payble

//optimiser avec compression de données
    struct RentalOffer{
        // mapping(string => uint256) params;
   
        uint256 tokenId;
        uint256 actionsRemaining;
        uint256 price;
        uint256 endTime;
        uint256 index;
             address borrower;
    }

uint256[] internal _tokensOnRent; //virer qd offre prise
address[] internal _borrowers;
mapping(uint256 => RentalOffer) _tokenIdToRentalOffer;
mapping(address => uint256[]) _borrowerToTokenList;


/**
*@dev open a contract for a supplier
* - set the supplier's address and address of KittyContract
*/
  function initialize(address supplier, address kittyContractAddress) public {
        require(_supplier == address(0));
_supplier = supplier; 
setKittyContract(kittyContractAddress);
    }

/**
*@dev set the address of KittyContract
*/
    function setKittyContract(address kittyContractAddress) public {
        _kittyContract = KittyContract(kittyContractAddress);

    }

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

) {
    RentalOffer storage offer = _tokenIdToRentalOffer[token];
 
    return(
 offer.tokenId,
        offer.actionsRemaining,
        offer.price,
       offer.endTime,
        offer.index,
            offer.borrower,
            _supplier
    );
}

/**
*@dev return the number of token on rent
*/
function getTotalOnRent() public returns(uint256) {
 return _tokensOnRent.length;
}

/**
*@dev return the number of token available for borrower
*/
function getTotalOfBorrower(address borrower) public returns(uint256) {
 return _borrowerToTokenList[borrower].length;
}

/**
*@dev return all tokenId on rent
*/
function getAllTokenOnRent() public view returns(uint256[] memory listOfTokens) {

    uint256 total = _tokensOnRent.length;
    listOfTokens = new uint256[](total);

    if(total > 0){
        for(uint256 i = 0; i < total; i++){
            if(isActive(_tokensOnRent[i])){
                listOfTokens[i] = _tokensOnRent[i];
            }
        }
    }
}

/**
*@dev return the tokenId availbale for 'borrower'
*/
function getAvalaibleTokensOf(address borrower)public returns(uint256[] memory listOfTokens) {
        uint256 total = _borrowerToTokenList[borrower].length;
    listOfTokens = new uint256[](total);

    if(total > 0){
        for(uint256 i = 0; i < total; i++){
            if(isStillValid(_borrowerToTokenList[borrower][i])){ //check valid
                listOfTokens[i] = _borrowerToTokenList[borrower][i];
            }
        }
    }
}

/**
*@dev set an offer
* - MarketPlaces or contracts suppliers have to checks that the token isn't on sale
* to prevent a rental offer or notify borrowers.
* - It must give approval to the contract address before to call it
* - an accepted offer must always be completed
*/
    function setRentalOffer(address from, uint256 tokenId, uint256 numberOfUse, uint256 price) public {
        require(!isStillValid(tokenId));
    require(from == _supplier);
    require(_kittyContract.isApprovedForAll(from, msg.sender), "calling contract needs to be approved as operator");
    require(_kittyContract.getApproved(tokenId) == address(this));  //besoin que marketplace donne approve

    // mapping(string => uint256) storage params;
    // tokendId= tokenId;
    //     actionsRemaining= numberOfUse;
    //     price= price;
    //     endTime= 0;
    //     index= _tokensOnRent.length;
            // RentalOffer storage offer;

     RentalOffer memory offer = RentalOffer({
              tokenId: tokenId,
        actionsRemaining: numberOfUse,
        price: price,
        endTime: 0,
        index: _tokensOnRent.length,
        borrower : address(0)
    });
    _tokenIdToRentalOffer[tokenId] = offer;
    _tokensOnRent.push(tokenId);

    //emit rental create

      //assert action>0 price>0 OU plutot require params entre >0
    }

/**
*@dev accept an offer
* - requirements : msg.value == price
* - set the params to let the borrower use the token
* - add msg.value to the supplier's balance
*/
    function takeRentalOffer(uint256 tokenId, address borrower) payable public {
        require(msg.value == _tokenIdToRentalOffer[tokenId].price); //checker si valide offre toujours/pas prise
        require(isActive(tokenId));
        
        _tokenIdToRentalOffer[tokenId].borrower = borrower;
        _tokenIdToRentalOffer[tokenId].endTime = block.timestamp + _duration;
_frozenBalance += msg.value;
// _kittyContract.approve(borrower, tokenId); //NON COMPTE GOUTTE
    }

/**
*@dev close an offer
* - requirements : offer is completed or not accepted yet
*/
function closeRentalOffer(uint256 tokenId) public {
    // require(_tokenIdToRentalOffer[tokenId].actionsRemaining == 0 || endOftime < block.timestamp);
    require(!isStillValid(tokenId));

uint256 lastIndex = _tokensOnRent.length - 1;
        _tokensOnRent[_tokenIdToRentalOffer[tokenId].index]= _tokensOnRent[lastIndex];
        _tokensOnRent.length--;
        //modif suivant struct
        delete _tokenIdToRentalOffer[tokenId];
    //     .borrower=address(0);
    // _tokenIdToRentalOffer[tokenId].endTime=0;
    // _tokenIdToRentalOffer[tokenId].actionLeft=0;
    //  _tokenIdToRentalOffer[tokenId].price=0;

    //ideallement faudrait un remove approval
    _kittyContract.approve(_supplier, tokenId);
    //assert action>0 price>0 
}



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
function consumeAction(uint256 dadRentedId, uint256 mumBorrowerId) public {
require(_tokenIdToRentalOffer[dadRentedId].borrower == msg.sender);
require(isStillValid(dadRentedId));
require(_kittyContract.getApproved(mumBorrowerId) == address(this));
//dadID borrower est bien lender de dadId
//mum borrower is owner and 
//offre toujours valide et boorowerok

//check si owner dad toujours supplier => sinon stop et refund (rupture du contract)
//Il appartient au loueur de pas mettre en vente => ds ce cas refund du borrower
if(_kittyContract.ownerOf(dadRentedId) == _supplier) {
    _tokenIdToRentalOffer[dadRentedId].actionsRemaining--;
    uint256 kittenId = _kittyContract.breed(dadRentedId, mumBorrowerId);
    _kittyContract.transferFrom(address(this), msg.sender, kittenId);
 _kittyContract.approve(msg.sender, mumBorrowerId);
} else {
    _tokenIdToRentalOffer[dadRentedId].actionsRemaining = 0;
    refund(msg.sender, _tokenIdToRentalOffer[dadRentedId].price);
}
if(_tokenIdToRentalOffer[dadRentedId].actionsRemaining == 0) {
    closeRentalOffer(dadRentedId);
}
//si derniere action => price de frozen à balance

}

/**
*@dev checks if offer is still availbale (not taken and not cancelled)
*/
function isActive(uint256 tokenId) public view returns(bool) {
    return _tokenIdToRentalOffer[tokenId].borrower == address(0) && _tokenIdToRentalOffer[tokenId].actionsRemaining != 0;

}

/**
*@dev checks if offer is still valid (offer is taken and not ended)
*/
function isStillValid(uint256 tokenId) public view returns(bool) {
    return _tokenIdToRentalOffer[tokenId].borrower != address(0) && (_tokenIdToRentalOffer[tokenId].actionsRemaining > 0 || _tokenIdToRentalOffer[tokenId].endTime > block.timestamp);

}


/**
*@dev refunds the borrower is contract is broken
*/
function refund(address borrower, uint256 price) private {
    require(_frozenBalance >= price);

_frozenBalance -= price;
_withdraw(borrower, price);
}

/**
*@dev allows the supplier to withdraw his reward
*/
function withdraw() public  {
    require(msg.sender == _supplier);
    require(_supplierBalance > 0);

      uint256 amount = _supplierBalance;
_supplierBalance = 0;
_withdraw(msg.sender, amount);
}

/**
*@dev allows the supplier to withdraw his reward
*/
function _withdraw(address to, uint256 amount) private  {
    require(msg.sender == _supplier);
    require(_supplierBalance > 0);

      address payable addrOfUser = address(uint160(to));
      addrOfUser.transfer(amount);

}

}