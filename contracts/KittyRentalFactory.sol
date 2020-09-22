pragma solidity ^0.5.00;

import "./CloneFactory.sol";
import "./IKittyRental.sol";
import "./KittyContract.sol";
import "./Ownable.sol";
import "./Pausable.sol";

/**
 *@dev creates minimal proxies as clones
 * - as it's minimal proxies we don't have selfdestruct function
 * - if selfdestruct is called in the master then all clones will be unavailable
 * So we can't free the EVM from clones after their use. In order to limit the space of their deployment
 * instead of having a rental contract by rent, a contract is attached to each user and reinitialized at each use
 * cost evaluation : 143.352gas (blog.goodaudience.com/attack-of-the-clones-how-dda-contracts-are-so-cheap-to-deploy-f3cee9c7566)
 *
 * the factory creates clones and manages clones addresses
 * it's in charge of giving the good contract address for a rental offer
 *
 *TODO : : implement version 18 of clone factory with js script to obtain vanilla
 *address beginning with 4*0 to reduce clone cost
 */
contract KittyRentalFactory is CloneFactory, Ownable, Pausable {
    address private _kittyContract;
    address[] private _contractsList;
    address[] private _masterContractVersions;

    mapping(address => address) private supplierToContract;

    event RentalFactoryOperation(
        string description,
        address cloneAddress,
        address supplier,
        uint256 version
    );

    /**
     *@dev initalizes the factory with KittyContract and Master RentalContract addresses
     */
    function initialize(address rentalContract, address kittyContract)
        public
        onlyOwner
    {
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
     *@dev update KittyContract address for all rental contracts
     */
    function updateKittyContract(address kittyContract) public onlyOwner {
        for (uint256 i = _contractsList.length - 1; i >= 0; i--) {
            IKittyRental(_contractsList[i]).setKittyContract(kittyContract);
        }
    }

    /**
     *@dev checks if 'supplier' has a contract
     */
    function hasContract(address supplier) public view returns (bool) {
        return supplierToContract[supplier] != address(0);
    }

    /**
     *@dev returns the contract address of 'supplier'
     */
    function getContractOfSupplier(address supplier)
        public
        view
        returns (address)
    {
        return supplierToContract[supplier];
    }

    /**
     *@dev returns the contract address attached to the tokenId
     *
     *TODO : require if owner still owns the tokenId
     */
    function getContractOfToken(uint256 tokenId) public view returns (address) {
        address owner = KittyContract(_kittyContract).ownerOf(tokenId);
        return supplierToContract[owner];
    }

    /**
     *@dev returns the list of all the tokens on rent
     */
    function getAllTokenOnRent() public returns (uint256[] memory tokenList) {
        uint256 numberOfTokenOnRent = getTotalOnRent();
        tokenList = new uint256[](numberOfTokenOnRent);

        for (uint256 i = 0; i < _contractsList.length; i++) {
            uint256[] memory temp = IKittyRental(_contractsList[i])
                .getAllTokenOnRent();
            for (uint256 j = 0; j < temp.length; j++) {
                tokenList[i + j] = temp[j];
            }
        }
    }

    /**
     *@dev returns the number of token on rent in all contracts
     */
    function getTotalOnRent() public returns (uint256) {
        uint256 numberOfTokens;
        for (uint256 i = 0; i < _contractsList.length; i++) {
            numberOfTokens += IKittyRental(_contractsList[i]).getTotalOnRent();
        }
        return numberOfTokens;
    }

    /**
     *@dev returns the list of available tokenIds for 'borrower'
     * - 0 for contracts no more valid or not yet cleaned from the list
     */
    function getAvalaibleTokensOf(address borrower)
        public
        returns (uint256[] memory tokenList)
    {
        uint256 totalOfBorrower = getTotalOfBorrower(borrower);
        tokenList = new uint256[](totalOfBorrower);

        for (uint256 i = 0; i < _contractsList.length; i++) {
            uint256[] memory temp = IKittyRental(_contractsList[i])
                .getAvalaibleTokensOf(borrower);
            for (uint256 j = 0; j < temp.length; j++) {
                tokenList[i + j] = temp[j];
            }
        }
    }

    /**
     *@dev returns the number of tokens availbale for the borrower in all contracts
     */
    function getTotalOfBorrower(address borrower) public returns (uint256) {
        uint256 numberOfTokens;
        for (uint256 i = 0; i < _contractsList.length; i++) {
            numberOfTokens += IKittyRental(_contractsList[i])
                .getTotalOfBorrower(borrower);
        }
        return numberOfTokens;
    }

    /**
     *@dev creates a clone of master contract
     * - supplier must have 0 contract registered to create one
     * - only an approved operator can call createClone
     */
    function createRentalContract(address supplier)
        public
        returns (address contractAddress)
    {
        require(supplierToContract[supplier] == address(0), "only one contract by supplier");
        // require(_kittyContract.isApprovedForAll(supplier, msg.sender));

        uint256 lastVersion = _masterContractVersions.length - 1;
        contractAddress = createClone(_masterContractVersions[lastVersion]);

        _contractsList.push(contractAddress);
        supplierToContract[supplier] = contractAddress;

        IKittyRental(contractAddress).initialize(supplier, _kittyContract);

        emit RentalFactoryOperation(
            "RentalContract created",
            contractAddress,
            supplier,
            lastVersion
        );
    }

    /**
     *@dev checks that the contract is a clone of one of the valid versions
     */
    function isKittyRental(address addressToTest)
        internal
        view
        returns (bool result)
    {
        for (uint256 i = _masterContractVersions.length - 1; i >= 0; i--) {
            if (isClone(_masterContractVersions[i], addressToTest)) {
                result = true;
                break;
            }
        }
    }
}
