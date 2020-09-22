// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

import "./KittyContract.sol";
import "./IKittyRental.sol";

/**
 *@dev This is the master contract of clones
 * - a clone address is attached to a supplier this clone manages all of its rental offers
 * - clones have only differents states (variables) but no logic
 */
contract KittyRentalContract is IKittyRental {
    /***************************************************
    Variables
     **************************************************/
    KittyContract private _kittyContract;

    uint256 constant _duration = 1 days;
    uint256 private _frozenBalance;
    uint256 private _supplierBalance;
    address private _supplier;

    //optimiser avec compression de données
    struct RentalOffer {
        // mapping(string => uint256) params;
        uint256 tokenId;
        uint256 actionsRemaining;
        uint256 price;
        uint256 endTime;
        uint256 index;
        address borrower;
    }

    uint256[] private _tokensOnRent;
    address[] private _borrowers;
    mapping(uint256 => RentalOffer) private _tokenIdToRentalOffer;
    mapping(address => uint256[]) private _borrowerToTokenList;

    /***************************************************
    Events
     **************************************************/
    event RentalOperation(
        string Type,
        address contrat,
        address user,
        uint256 tokenId
    );
    event Funding(string Type, address contrat, address user, uint256 amount);

    /***************************************************
    External Functions
     **************************************************
     /**
     *@dev return the offer for tokenId
     */
    function getRentalOffer(uint256 token)
        external
        view
        returns (
            uint256 tokenId,
            uint256 actionsRemaining,
            uint256 price,
            uint256 endTime,
            uint256 index,
            address borrower,
            address supplier
        )
    {
        RentalOffer storage offer = _tokenIdToRentalOffer[token];

        return (
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
     *@dev return all tokenIds on rent
     */
    function getAllTokenOnRent()
        external
        view
        returns (uint256[] memory listOfTokens)
    {
        uint256 total = _tokensOnRent.length;
        listOfTokens = new uint256[](total);

        if (total > 0) {
            for (uint256 i = 0; i < total; i++) {
                if (isActive(_tokensOnRent[i])) {
                    listOfTokens[i] = _tokensOnRent[i];
                }
            }
        }
    }

    /**
     *@dev return the number of tokens on rent
     */
    function getTotalOnRent() external returns (uint256) {
        return _tokensOnRent.length;
    }

    /**
     *@dev return the number of tokens available for 'borrower'
     */
    function getTotalOfBorrower(address borrower) external returns (uint256) {
        return _borrowerToTokenList[borrower].length;
    }

    /**
     *@dev return the tokenIds available for 'borrower'
     */
    function getAvalaibleTokensOf(address borrower)
        external
        returns (uint256[] memory listOfTokens)
    {
        uint256 total = _borrowerToTokenList[borrower].length;
        listOfTokens = new uint256[](total);

        if (total > 0) {
            for (uint256 i = 0; i < total; i++) {
                if (isStillValid(_borrowerToTokenList[borrower][i])) {
                    //check valid
                    listOfTokens[i] = _borrowerToTokenList[borrower][i];
                }
            }
        }
    }

    /**
     *@dev open a contract for a supplier
     * - set the supplier's address and address of KittyContract
     *
     *TODO : require msg.sender should be the factory
     */
    function initialize(address supplier, address kittyContractAddress)
        external
    {
        require(_supplier == address(0), "supplier already set");
        _supplier = supplier;
        _kittyContract = KittyContract(kittyContractAddress);

        emit RentalOperation("contract open", address(this), supplier, 0);
    }

    /**
     *@dev set the address of KittyContract
     *
     *TODO : require msg.sender should be the factory
     */
    function setKittyContract(address kittyContractAddress) external {
        _kittyContract = KittyContract(kittyContractAddress);
    }

    /**
     *@dev set an offer
     * - MarketPlaces or contracts suppliers have to checks that the token isn't on sale
     * to prevent a rental offer or notify borrowers.
     * - It must give approval to the contract address (clone) before to call it
     * - an accepted offer must always be completed
     * - if 'supplier' sell the token while a rental offer is processing
     * the contract is broken and 'borrower' will be refunded
     * -requirements:
     * no offer for the tokenId in progress
     * from is the supplier
     * msg.sender is an approved operator
     * the contract is approved for tokenId BEFORE calling the function
     */
    function setRentalOffer(
        address from,
        uint256 tokenId,
        uint256 numberOfUse,
        uint256 price
    ) external {
        require(!isStillValid(tokenId), "an offer completed is already in progress");
        require(from == _supplier, "from should be supplier");
        require(
            _kittyContract.isApprovedForAll(from, msg.sender),
            "calling contract needs to be approved as operator"
        );
        require(_kittyContract.getApproved(tokenId) == address(this), "contract needs to be approved for tokenId first");

        RentalOffer memory offer = RentalOffer({
            tokenId: tokenId,
            actionsRemaining: numberOfUse,
            price: price,
            endTime: 0,
            index: _tokensOnRent.length,
            borrower: address(0)
        });

        _tokenIdToRentalOffer[tokenId] = offer;
        _tokensOnRent.push(tokenId);

        emit RentalOperation(
            "offer created",
            address(this),
            _supplier,
            tokenId
        );
    }

    /**
     *@dev accept an offer
     * - requirements : msg.value == price
     * - set the params to let the borrower use the token
     * - add msg.value to the supplier's balance
     */
    function takeRentalOffer(uint256 tokenId, address borrower)
        external
        payable
    {
        require(msg.value == _tokenIdToRentalOffer[tokenId].price, "amount don't match the price");
        require(isActive(tokenId), "offer not available");

        _tokenIdToRentalOffer[tokenId].borrower = borrower;
        _tokenIdToRentalOffer[tokenId].endTime = block.timestamp + 1 days; // _duration;
        _frozenBalance += msg.value;

        emit RentalOperation(
            "offer accepted",
            address(this),
            borrower,
            tokenId
        );
    }

    /***************************************************
    Public Functions
     **************************************************/
    /**
     *@dev checks if offer is still availbale (not taken and not cancelled)
     */
    function isActive(uint256 tokenId) public view returns (bool) {
        return
            _tokenIdToRentalOffer[tokenId].borrower == address(0) &&
            _tokenIdToRentalOffer[tokenId].actionsRemaining != 0;
    }

    /**
     *@dev checks if offer is still valid (offer is taken and not ended)
     */
    function isStillValid(uint256 tokenId) public view returns (bool) {
        return
            _tokenIdToRentalOffer[tokenId].borrower != address(0) &&
            (_tokenIdToRentalOffer[tokenId].actionsRemaining > 0 ||
                _tokenIdToRentalOffer[tokenId].endTime > block.timestamp);
    }

    /**
     *@dev allows the borrower to exercise his right
     * to call from front end with clone address
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
        require(_tokenIdToRentalOffer[dadRentedId].borrower == msg.sender, "sender should be the borrower");
        require(isStillValid(dadRentedId), "offer not avalaible : completed or timeout");
        require(_kittyContract.getApproved(mumBorrowerId) == address(this), "contract needs to be approved for mumId first");

        if (_kittyContract.ownerOf(dadRentedId) == _supplier) {
            _tokenIdToRentalOffer[dadRentedId].actionsRemaining--;
            uint256 kittenId = _kittyContract.breed(dadRentedId, mumBorrowerId);
            _kittyContract.transferFrom(address(this), msg.sender, kittenId);
            _kittyContract.approve(msg.sender, mumBorrowerId);

            if (_tokenIdToRentalOffer[dadRentedId].actionsRemaining == 0) {
                _unfreeze(dadRentedId);
                _closeRentalOffer(dadRentedId);
            }
        } else {
            _tokenIdToRentalOffer[dadRentedId].actionsRemaining = 0;
            _refund(msg.sender, _tokenIdToRentalOffer[dadRentedId].price);
            _closeRentalOffer(dadRentedId);
        }

        emit RentalOperation(
            "action used",
            address(this),
            msg.sender,
            dadRentedId
        );
    }

    /**
     *@dev allows the supplier to withdraw his reward
     */
    function withdraw() public {
        require(msg.sender == _supplier, "sender should be the supplier");
        require(_supplierBalance > 0, "no balance to withdraw");

        uint256 amount = _supplierBalance;
        _supplierBalance = 0;
        _withdraw(msg.sender, amount);

        emit Funding("withdraw done", address(this), _supplier, amount);
    }

    /***************************************************
    Private Functions
     **************************************************/
    /**
     *@dev close an offer
     * - gives back the approval for the token
     * - requirements : offer is completed or not accepted yet
     */
    function _closeRentalOffer(uint256 tokenId) private {
        require(!isStillValid(tokenId), "offer taken and not completed can't be canceled");

        uint256 lastIndex = _tokensOnRent.length - 1;
        _tokensOnRent[_tokenIdToRentalOffer[tokenId]
            .index] = _tokensOnRent[lastIndex];
        _tokensOnRent.length--;

        delete _tokenIdToRentalOffer[tokenId];

        _kittyContract.approve(_supplier, tokenId);
    }

    /**
     *@dev unfreeze the amount of the offer when completed
     */
    function _unfreeze(uint256 tokenId) private {
        uint256 amount = _tokenIdToRentalOffer[tokenId].price;
        require(amount <= _frozenBalance, "amount to unfreeze > frozen balance");

        _frozenBalance -= amount;
        _supplierBalance += amount;

        emit Funding("unfreeze done", address(this), _supplier, amount);
    }

    /**
     *@dev refunds the borrower if contract is broken
     */
    function _refund(address borrower, uint256 price) private {
        require(_frozenBalance >= price, "amount to refund > frozen balance");

        _frozenBalance -= price;
        _withdraw(borrower, price);

        emit Funding("refund done", address(this), borrower, price);
    }

    /**
     *@dev allows the supplier to withdraw his reward
     */
    function _withdraw(address to, uint256 amount) private {
        address payable addrOfUser = address(uint160(to));
        addrOfUser.transfer(amount);
    }
}
