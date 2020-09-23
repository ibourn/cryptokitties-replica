// SPDX-License-Identifier: MIT
pragma solidity ^0.5.12;

import "./IERC721.sol";
import "./IERC721Receiver.sol";
import "./KittyStorage.sol";
import "./IKittyRental.sol";

/**
@dev Implementation of the 'erc721 token' functions
*/
contract KittyToken is IERC721, KittyStorage {
    /***************************************************
    Events
     **************************************************/
    /**
    @dev Emitted when `tokenId` token is transfered from `from` to `to`.
     */
    event Transfer(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId
    );

    /**
    @dev Emitted when `owner` enables `approved` to manage the `tokenId` token.
     */
    event Approval(
        address indexed owner,
        address indexed approved,
        uint256 indexed tokenId
    );

    /**
    @dev Emitted when `owner` enables or disables (`approved`) `operator` to manage all of its assets.
     */
    event ApprovalForAll(
        address indexed owner,
        address indexed operator,
        bool approved
    );

    /***************************************************
    External Functions
     **************************************************/
    /**
    @notice IERC721 : Returns the number of tokens in ``owner``'s account.
     */
    function balanceOf(address owner) external view returns (uint256 balance) {
        return _ownershipTokenCount[owner];
    }

    /**
    @notice IERC721 : Returns the owner of the `tokenId` token. 
     */
    function ownerOf(uint256 tokenId) external view returns (address owner) {
        require(
            _kitties.length > tokenId,
            "No owner, the tokenId doesn't exist yet"
        );

        return _kittyIndexToOwner[tokenId];
    }

    /**
    @notice IERC721 : Returns the total number of tokens in circulation.
     */
    function totalSupply() external view returns (uint256 total) {
        return _kitties.length;
    }

    /**
    @notice IERC721 : Returns the name of the token.
     */
    function name() external view returns (string memory tokenName) {
        return _TOKENNAME;
    }

    /**
    @notice IERC721 : Returns the symbol of the token.
     */
    function symbol() external view returns (string memory tokenSymbol) {
        return _TOKENSYMBOL;
    }

    /**
    @dev checks if interfaceId supports IERC721 or IERC165
    */
    function supportsInterface(bytes4 interfaceId)
        external
        pure
        returns (bool)
    {
        return (interfaceId == _INTERFACE_ID_ERC721 ||
            interfaceId == _INTERFACE_ID_ERC165);
    }

    /** 
    @notice IERC721 : Transfers `tokenId` token from `msg.sender` to `to`.
    - call _transfer(from, to , tokenId)
     */
    function transfer(address to, uint256 tokenId) external {
        require(to != address(0), "query transfer to 0 address");
        require(to != address(this), "query transfer to contract address");
        require(_owns(msg.sender, tokenId), "sender is not the token owner");

        _transfer(msg.sender, to, tokenId);
    }

    /***************************************************
    Public Functions
     **************************************************/
    /** 
    @notice IERC721 : Get the approved address for a single NFT
    */
    function getApproved(uint256 tokenId) public view returns (address) {
        require(tokenId < _kitties.length, "tokenId doesn't exist");

        return _kittyIndexToApproved[tokenId];
    }

    /** 
    @notice IERC721 : Query if an address is an authorized operator for another address
    */
    function isApprovedForAll(address owner, address operator)
        public
        view
        returns (bool)
    {
        return _operatorApprovals[owner][operator];
    }

    /**  
    @notice IERC721 :  Change or reaffirm the approved address for an NFT
    */
    function approve(address to, uint256 tokenId) public {
        require(
            _owns(msg.sender, tokenId) ||
            _approvedFor(msg.sender, tokenId) ||
            _approvedByOwner(msg.sender, tokenId), "sender should be owner of token or approved for it"
        );

        _approve(tokenId, to);
        emit Approval(msg.sender, to, tokenId);
    }

    /** 
    @notice IERC721 : Enable or disable approval for a third party ("operator") to manage
      all of `msg.sender`'s assets
*    */
    function setApprovalForAll(address operator, bool approved) public {
        require(operator != msg.sender, "sender can't be the operator");

        _setApprovalForAll(msg.sender, operator, approved);
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    /**
    @notice IERC721 : Transfers the ownership of an NFT from one address to another address
    */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) public {
        require(_isApprovedOrOwner(msg.sender, from, to, tokenId), "sender should be owner or approved");

        _safeTransfer(from, to, tokenId, data);
    }

    /**
    @notice IERC721 : Transfers the ownership of an NFT from one address to another address
   */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public {
        safeTransferFrom(from, to, tokenId, "");
    }

    /**
    @notice IERC721 : Transfer ownership of an NFT -- THE CALLER IS RESPONSIBLE
      TO CONFIRM THAT `to` IS CAPABLE OF RECEIVING NFTS OR ELSE
      THEY MAY BE PERMANENTLY LOST
    */
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public {
        require(_isApprovedOrOwner(msg.sender, from, to, tokenId), "sender should be owner or approved");

        _transfer(from, to, tokenId);
    }

    /***************************************************
    Internal Functions
     **************************************************/
    /**
    @dev helper : check if owner owns this token
     */
    function _owns(address pretender, uint256 tokenId)
        internal
        view
        returns (bool isOwner)
    {
        return (_kittyIndexToOwner[tokenId] == pretender);
    }
    
    /** 
    @dev Transfer : main function 
    Emits a {Transfer} event.
     */
    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal {
        _ownershipTokenCount[to]++;

        _kittyIndexToOwner[tokenId] = to;

        if (from != address(0)) {
            _ownershipTokenCount[from]--;
            delete _kittyIndexToApproved[tokenId];
        }

        emit Transfer(msg.sender, to, tokenId);
    }

    /***************************************************
     Private Functions
     **************************************************/
    /** 
    @dev helper : checks if sender is owner or approved
    * - as this check is called by transfer functions, it also checks
    * that 'sender' is not the borrower of the token to prevent the use
    * of approval to sell the token
    */
    function _isApprovedOrOwner(
        address sender,
        address from,
        address to,
        uint256 tokenId
    ) private view returns (bool) {
        require(tokenId < _kitties.length, "tokenId doesn't exist");
        require(to != address(0), "to can't be address 0");
        require(_owns(from, tokenId), "from should be owner of tokenId");
        //DEBUG require(_owns(from, tokenId), "KittyToken line250/ from should be owner of tokenId");

        return (sender == from ||
            isApprovedForAll(from, sender) ||
            _approvedFor(sender, tokenId));
    }

    /**
    @dev checks if operator has approval for this tokenId
    */
    function _approvedFor(address pretender, uint256 tokenId)
        private
        view
        returns (bool)
    {
        return _kittyIndexToApproved[tokenId] == pretender;
    }

    /**
    @dev checks if operator is an authorized operator of the current owner
    */
    function _approvedByOwner(address pretender, uint256 tokenId)
        private
        view
        returns (bool)
    {
        return _operatorApprovals[_kittyIndexToOwner[tokenId]][pretender];
    }

    /**
    @dev helper : checks if it's acontract or a wallet address
    - !! : at creation, contract has a size of 0 but can execute function in the constructor  
    */
    function _isContract(address to) private view returns (bool) {
        uint32 size;
        assembly {
            size := extcodesize(to)
        }
        return size > 0;
    }

    /**
    @dev set an approved address for a token
     */
    function _approve(uint256 tokenId, address approved) private {
        _kittyIndexToApproved[tokenId] = approved;
    }

    /**
    @dev set an approved operator address for an owner
    */
    function _setApprovalForAll(
        address owner,
        address operator,
        bool approved
    ) private {
        _operatorApprovals[owner][operator] = approved;
    }

    /**
    @dev transfers tokenId 
    */
    function _safeTransfer(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) private {
        require(_checkERC721Support(from, to, tokenId, data), "checkERC721Support failed");
        _transfer(from, to, tokenId);
    }

    /**
    @dev checks if receiver supports ERC721 
    */
    function _checkERC721Support(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) private returns (bool) {
        if (!_isContract(to)) {
            return true;
        }

        bytes4 returnData = IERC721Receiver(to).onERC721Received(
            msg.sender,
            from,
            tokenId,
            data
        );
        return returnData == _MAGIC_ERC721_RECEIVED;
    }
    
}
