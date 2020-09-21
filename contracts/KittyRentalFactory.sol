pragma solidity ^0.5.00;

import "./CloneFactory.sol";
import "./IKittyRental.sol";
import "./KittyContract.sol";
import "./Ownable.sol";

//import clone irental kitty

/**
*@notice adapted from https://github.com/optionality/clone-factory/blob/master/contracts/CloneFactory.sol
*(see https://eips.ethereum.org/EIPS/eip-1167)
*with the following notice : 
*
*The MIT License (MIT)
*Copyright (c) 2018 Murray Software, LLC.
*Permission is hereby granted, free of charge, to any person obtaining
*a copy of this software and associated documentation files (the
*"Software"), to deal in the Software without restriction, including
*without limitation the rights to use, copy, modify, merge, publish,
*distribute, sublicense, and/or sell copies of the Software, and to
*permit persons to whom the Software is furnished to do so, subject to
*the following conditions:
*The above copyright notice and this permission notice shall be included
*in all copies or substantial portions of the Software.
*THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
*OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
*MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
*IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
*CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
*TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
*SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*
*@dev creates minimal proxies as clones
* - as it's minimal proxies we don't have selfdestruct function
* - if selfdestruct is called in the master then all clones will be unavailable
* So we can't free the EVM from clones after their use. In order to limit the space of their deployment
* instead of having a rental contract by rent, a contract is attached to each user and reinitialized at each use
* cost evaluation : 143.352gas (blog.goodaudience.com/attack-of-the-clones-how-dda-contracts-are-so-cheap-to-deploy-f3cee9c7566)
*
at first use
*/

contract KittyRentalFactory is CloneFactory, Ownable {

address _kittyContract;
//KittyContract _kittyContract;
address[] _contractsList;//IKittyRental[] _contractsList; //add des contracts ou add puis transfo en Irental
address[] _masterContractVersions;//add masters

// address[] _suppliersList;
mapping(address => address) supplierToContract;
// address[] _contractsList;


//ATTENTIONONLYOWNER
    event CloneCreation(string description, address cloneAddress, uint256 version);


//supplier
//get token on rent
//get tokenRented



/**
*@dev initalizes the factory with KittyContract and Master RentalContract addresses
*/
function initialize(address rentalContract, address kittyContract) public onlyOwner{
setKittyRentalContract(rentalContract);
setKittyContract(kittyContract);
}

/**
*@dev sets address of the latest version of the master contract
* -at creation and for updates
*/
function setKittyRentalContract(address rentalContract) public onlyOwner {
    _masterContractVersions.push(rentalContract);
}

/**
*@dev sets address of the latest version of the master contract
* -at creation and for updates
*/
function setKittyContract(address kittyContract) public onlyOwner {
    _kittyContract = kittyContract;
    // updateKittyContract(kittyContract);
}

/**
*@dev creates a clone of master contract
*/
  function createRentalContract(address supplier) public returns (address contractAddress) {
require(supplierToContract[supplier] == address(0));
// require()//sender est approuvé

    uint256 lastVersion = _masterContractVersions.length - 1;
    contractAddress = createClone(_masterContractVersions[lastVersion]);
_contractsList.push(contractAddress);
    IKittyRental(contractAddress).initialize(supplier, _kittyContract);

    // emit RentalContractCreation("RentalContract created", contractAddress, lastVersion);
  }    

/**
*@dev checks that the contract is a clone of one of the valid versions
*/
    function isKittyRental(address addressToTest) internal view returns (bool result) {
        for(uint256 i = _masterContractVersions.length - 1; i >=0 ; i--){
            if(isClone(_masterContractVersions[i], addressToTest)){
                result = true;
                break;
            }
        }
  }

/**
*@dev update KittyContract address for all rental contracts
*/
function updateKittyContract(address kittyContract) private {
          for(uint256 i = _contractsList.length - 1; i >=0 ; i--){
            IKittyRental(_contractsList[i]).setKittyContract(kittyContract);
        }
}




function getContractOfSupplier(address supplier) public view returns(address) {
  return supplierToContract[supplier];
}




//get alltoken to rent => bcle contract => appel alltoken
//ajouter check des iterateurs
function getAllTokenOnRent() public returns(uint256[] memory tokenList) {
uint256 numberOfTokenOnRent = getTotalOnRent();
    tokenList = new uint256[](numberOfTokenOnRent);

  for(uint256 i = 0; i < _contractsList.length; i++){
        uint256[] memory temp = IKittyRental(_contractsList[i]).getAllTokenOnRent();//new uint256[](size);
for(uint256 j = 0; j < temp.length; j++){
  tokenList[i+j] = temp[j];
}

  }
}

function getTotalOnRent() private returns(uint256) {
  uint256 numberOfTokens;
    for(uint256 i = 0; i < _contractsList.length; i++){
numberOfTokens += IKittyRental(_contractsList[i]).getTotalOnRent();
  }
  return numberOfTokens;
}

//get add of token (mapping) =>kitty indextoowner => owner => contractlist
function getContractOfToken(uint256 tokenId) public view returns(address){
  address owner = KittyContract(_kittyContract).ownerOf(tokenId);
  return supplierToContract[owner];
}

function getAvalaibleTokensOf(address borrower) public returns(uint256[] memory tokenList) {
uint256 totalOfBorrower = getTotalOfBorrower(borrower);
    tokenList = new uint256[](totalOfBorrower);

  for(uint256 i = 0; i < _contractsList.length; i++){
        uint256[] memory temp = IKittyRental(_contractsList[i]).getAvalaibleTokensOf(borrower);//new uint256[](size);
for(uint256 j = 0; j < temp.length; j++){
  tokenList[i+j] = temp[j];
}

  }
}

function getTotalOfBorrower(address borrower) private returns(uint256) {
  uint256 numberOfTokens;
    for(uint256 i = 0; i < _contractsList.length; i++){
numberOfTokens += IKittyRental(_contractsList[i]).getTotalOfBorrower(borrower);
  }
  return numberOfTokens;
}

function hasContract(address supplier) public view returns(bool) {
  return supplierToContract[supplier] != address(0);
}
//get token of borrower => bcl contract => appel tok of borro

//POUR LE MOMENT PAS INTERSDICTON brEEDER SI LOUER CAR PAS LIMITE 

//=> 

//get 

// UPDATE KITTY CONTRACT ADDRESS => BCLE CONTRAT set add//


}