pragma solidity ^0.5.12;

contract Ownable{
    address public _owner;
    
     modifier onlyOwner(){
        require(msg.sender == _owner);
        _; 
    }
    
    constructor() public{
        _owner = msg.sender;
    }
    
}