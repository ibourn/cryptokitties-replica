pragma solidity ^0.5.12;


/**
*  @dev -Allows to pause functions of the contract
 */
contract Pausable {

    /**
    *  @dev storage of the 'paused' state
     */
     bool internal _paused;

    /**
    *  @dev modifiers check the 'paused' state
     */
     modifier whenNotPaused() {
         require(!_paused);
         _;
     }

     modifier whenPaused() {
         require(_paused);
         _;
     }
}