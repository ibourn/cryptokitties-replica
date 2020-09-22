// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

import "./KittyMarketStorage.sol";
import "./IKittyMarketPlace.sol";

/**
 *@dev this is the logic of the market place used to :
 * - place / take  buy or rental offers
 * - buy offers are managed by the marketplace
 * - rental offers are a third service that it forwards
 */
contract KittyMarketContract is KittyMarketStorage, IKittyMarketPlace {
    /***************************************************
    Events
     **************************************************/
    event MarketTransaction(string TxType, address owner, uint256 tokenId);
    event Funding(string Operation, address user, uint256 amount);

    /***************************************************
    External Functions
     **************************************************/
    /***************************************************
    Public Functions
     **************************************************/
    // /**
    //  *@dev Inititates needed initialisations at creation
    //  */
    // constructor(address kittyContractAddress) public {
    //     setKittyContract(kittyContractAddress);
    // }

    /**
     *@dev Initializes contract at migration through proxy
     */
    function initialize(
        address kittyContractAddress,
        address rentalContractFactory
    ) public onlyOwner {
        setKittyContract(kittyContractAddress);
        setKittyRentalContract(rentalContractFactory);
    }

    /**
     *@dev Sets the address of the Kitty contract to interact with
     */
    function setKittyContract(address kittyContractAddress) public onlyOwner {
        _kittyContract = KittyContract(kittyContractAddress);
    }

    /**
     *@dev Sets the address of the Kitty contract to interact with
     */
    function setKittyRentalContract(address rentalContractAddress)
        public
        onlyOwner
    {
        _kittyRentalFactory = KittyRentalFactory(rentalContractAddress);
    }

    //******************************************************************
    //
    //
    // PART CONCERNING RENT CONTRACT (reorg after debug)
    //
    //
    // ********************************************************************

    function getRentalOffer(uint256 token)
        public
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
        (
            tokenId,
            actionsRemaining,
            price,
            endTime,
            index,
            borrower,
            supplier
        ) = IKittyRental(_kittyRentalFactory.getContractOfToken(token))
            .getRentalOffer(token);
    }

    /**
     *@dev Returns the list of offers
     */
    function getAllTokenOnRent() public returns (uint256[] memory) {
        uint256[] memory result = _kittyRentalFactory.getAllTokenOnRent();
        // return _kittyRentalFactory.getAllTokenOnRent();
        return result;
    }

      /**
     *@dev returns the contract address attached to the tokenId
     *
     *TODO : require if owner still owns the tokenId
     */
    function getContractOfToken(uint256 tokenId) public view returns (address tokenContract) {
        tokenContract =_kittyRentalFactory.getContractOfToken(tokenId);
    }

    /**
     *@dev sent an offer to rent a token
     */
    function setRentalOffer(
        address from,
        uint256 tokenId,
        uint256 numberOfUse,
        uint256 price
    ) public returns (address) {
        address contractOfSupplier;
        if (!_kittyRentalFactory.hasContract(msg.sender)) {
            contractOfSupplier = _kittyRentalFactory.createRentalContract(
                msg.sender
            );
        } else {
            contractOfSupplier = _kittyRentalFactory.getContractOfSupplier(
                msg.sender
            );
        }
        // emit TESTEVENT("setrental", contractOfSupplier);
        _kittyContract.approve(contractOfSupplier, tokenId);
        IKittyRental(contractOfSupplier).setRentalOffer(
            from,
            tokenId,
            numberOfUse,
            price
        );

        emit MarketTransaction("Rental offer created", msg.sender, tokenId);

        return contractOfSupplier;
    }

    /**
     *@dev Takes an offer (set the user as borrower of the token)
     */
    function takeRentalOffer(uint256 tokenId, address borrower)
        public
        payable
        returns (address)
    {
        address contractAddress = _kittyRentalFactory.getContractOfToken(
            tokenId
        );
        //  IKittyRental(contractAddress).takeRentalOffer.value(msg.value)(tokenId, borrower);

        IKittyRental add = IKittyRental(contractAddress);
        add.takeRentalOffer.value(msg.value)(tokenId, borrower);

        //  IKittyRental(contractAddress).takeRentalOffer{value:msg.value}(tokenId, borrower);

        emit MarketTransaction("Rental offer taken", borrower, tokenId);

        return contractAddress;
    }

    //******************************************************************
    //
    //
    // END OF PART CONCERNING RENT CONTRACT (reorg after debug)
    //
    //
    // ********************************************************************

    /**
     *@dev Returns the offer for the tokenId
     */
    function getOffer(uint256 _tokenId)
        public
        view
        returns (
            address seller,
            uint256 price,
            uint256 index,
            uint256 tokenId,
            bool active
        )
    {
        Offer storage offer = _tokenIdToOffer[_tokenId];

        return (
            offer.seller,
            offer.price,
            offer.index,
            offer.tokenId,
            offer.active
        );
    }

    /**
     *@dev Returns the list of offers
     */
    function getAllTokenOnSale()
        public
        view
        returns (uint256[] memory listOfOffers)
    {
        uint256 totalOffers = _offers.length;
        uint256[] memory result = new uint256[](totalOffers);

        if (totalOffers > 0) {
            for (uint256 i = 0; i < totalOffers; i++) {
                if (_offers[i].active) {
                    result[i] = _offers[i].tokenId;
                }
            }
        }
        return result;
    }

    /**
     *@dev Returns the balance of the user
     */
    function getBalanceOf(address user) public view returns (uint256 balance) {
        return _accountToBalance[user];
    }

    /**
     *@dev Creates a new offer
     */
    function setOffer(uint256 price, uint256 tokenId) public {
        require(
            _ownsKitty(msg.sender, tokenId),
            "you need to be the owner of the kitty"
        );
        require(
            !_tokenIdToOffer[tokenId].active,
            "only one offer by token at a time"
        );
        require(
            _kittyContract.isApprovedForAll(msg.sender, address(this)),
            "contract needs to be approved as operator"
        );

        Offer memory offer = Offer({
            seller: msg.sender,
            price: price,
            active: true,
            tokenId: tokenId,
            index: _offers.length
        });

        _tokenIdToOffer[tokenId] = offer;
        _offers.push(offer);

        emit MarketTransaction("Create Offer", msg.sender, tokenId);
    }

    /**
     *@dev Cancels an offer
     */
    function removeOffer(uint256 tokenId) public {
        require(
            _tokenIdToOffer[tokenId].seller == msg.sender,
            "only the seller can cancel the order"
        );

        deleteOffer(tokenId);

        emit MarketTransaction("Remove offer", msg.sender, tokenId);
    }

    /**
     *@dev Accepts an offer to buy a kitty
     * -delete the offer before the transfer to prevent reentry attack
     */
    function buyKitty(uint256 tokenId) public payable {
        require(
            msg.value == _tokenIdToOffer[tokenId].price,
            "the amount sent don't match the price"
        );
        require(_tokenIdToOffer[tokenId].active, "no offer for this token");

        address payable seller = _tokenIdToOffer[tokenId].seller;
        uint256 price = _tokenIdToOffer[tokenId].price;

        deleteOffer(tokenId);
        _deposit(seller, price);
        _kittyContract.transferFrom(seller, msg.sender, tokenId);

        emit MarketTransaction("Buy", msg.sender, tokenId);
    }

    /**
     *@dev Transfers funds from the user's account (the contract) to the user's address
     */
    function withdraw(address user) public {
        require(getBalanceOf(user) > 0, "no fund to withraw"); //address(this).balance, "rewards > balance");

        _withdraw(getBalanceOf(user), user);
    }

    /***************************************************
    Private Functions
     **************************************************/
    /**
     *@dev Returns the balance of the contract (the total of all accounts)
     */
    function getContractBalance() private view returns (uint256 balance) {
        return address(this).balance;
    }

    /**
     *@dev Checks that the owner owns the token
     */
    function _ownsKitty(address owner, uint256 tokenId)
        private
        view
        returns (bool)
    {
        return (_kittyContract.ownerOf(tokenId) == owner);
    }

    /**
     *@dev Deletes an offer
     */
    function deleteOffer(uint256 tokenId) private {
        uint256 lastIndex = _offers.length - 1;
        uint256 removedIndex = _tokenIdToOffer[tokenId].index;
        if (lastIndex > removedIndex) {
            _offers[lastIndex].index = removedIndex;
            _offers[removedIndex] = _offers[lastIndex];
        }
        _offers.length--;

        delete _tokenIdToOffer[tokenId];
    }

    /**
     *@dev Depostis fund on user's account, used to transfer fund after a buy action from buyer to seller
     */
    function _deposit(address receiver, uint256 amount) private {
        require(amount > 0, "no funds to deposit");

        _accountToBalance[receiver] += amount;
        emit Funding("Deposit", receiver, amount);
    }

    /**
     *@dev Transfers funds to user's account
     * - allows to respect the pull pattern and not transfer funds automatically when a user buy a kitty
     * - allows to save gas by not doing a withdraw for each buy action
     */
    function _withdraw(uint256 amount, address user) private {
        require(amount <= getBalanceOf(user), "amount to withdraw > balance");

        //cast adr to payable in solidity 0.5 : address(uint160(addr1))
        address payable addrOfUser = address(uint160(user));
        uint256 contractBalanceAfterTransfer = getContractBalance() - amount;

        _accountToBalance[user] -= amount;
        addrOfUser.transfer(amount);
        assert(getContractBalance() == contractBalanceAfterTransfer);

        emit Funding("Withdraw", user, amount);
    }
}
