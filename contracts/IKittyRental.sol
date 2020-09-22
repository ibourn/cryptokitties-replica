// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

/**
 *@dev this is the interface of rental contracts allowing to upgrade the master of clones
 */
interface IKittyRental {
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
        );

    /**
     *@dev return all tokenIds on rent
     */
    function getAllTokenOnRent()
        external
        view
        returns (uint256[] memory listOfTokens);

    /**
     *@dev return the number of tokens on rent
     */
    function getTotalOnRent() external returns (uint256);

    /**
     *@dev return the number of tokens available for 'borrower'
     */
    function getTotalOfBorrower(address borrower) external returns (uint256);

    /**
     *@dev return the tokenIds available for 'borrower'
     */
    function getAvalaibleTokensOf(address borrower)
        external
        returns (uint256[] memory listOfTokens);

    /**
     *@dev open a contract for a supplier
     * - set the supplier's address and address of KittyContract
     *
     *TODO : require msg.sender should be the factory
     */
    function initialize(address supplier, address kittyContractAddress)
        external;

    /**
     *@dev set the address of KittyContract
     *
     *TODO : require msg.sender should be the factory
     */
    function setKittyContract(address kittyContractAddress) external;

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
    ) external;

    /**
     *@dev accept an offer
     * - requirements : msg.value == price
     * - set the params to let the borrower use the token
     * - add msg.value to the supplier's balance
     */
    function takeRentalOffer(uint256 tokenId, address borrower)
        external
        payable;
}
