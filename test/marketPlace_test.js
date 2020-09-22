//const BigNumber = require('bignumber.js');
const truffleAssert = require("truffle-assertions");
const KittyToken = artifacts.require("KittyContract"); //build json name
const KittyProxy = artifacts.require("KittyProxy");
const KittyMarket = artifacts.require("KittyMarketContract");
const KittyMarketProxy = artifacts.require("KittyMarketProxy");
const KittyRental = artifacts.require("KittyRentalContract");
const RentalFactory = artifacts.require("KittyRentalFactory");

const Float_MIN = 1e-10;
//mocha mise en commentaire runner.js l846 // import truffle-assertions

contract('KittyMarketProxy', async function (accounts) {

  let cKitty, pKitty, iKitty, cMarket, pMarket, iMarket;

  // let option8 = {from : accounts[2], value : web3.utils.toWei("1", "ether")};
  // let option9 = {from : accounts[0], value : web3.utils.toWei("5", "ether")};


  before(async function () {
    pKitty = await KittyProxy.deployed()
    iKitty = await KittyToken.at(pKitty.address);

    pMarket = await KittyMarketProxy.deployed()
    iMarket = await KittyMarket.at(pMarket.address);

    await iKitty.createKittyGen0(1111111111111111);
    await iKitty.createKittyGen0(2222222222222222);
    await iKitty.createKittyGen0(3333333333333333);
    await iKitty.createKittyGen0(4444444444444444);
    await iKitty.createKittyGen0(5555555555555555);

    let supply = await iKitty.totalSupply();
    console.log("SUPPLY : " + supply.toString());
  });


  it("should set Market as operator of account 0", async function () {
    await iKitty.setApprovalForAll(iMarket.address, true, { from: accounts[0] });
    assert(iKitty.isApprovedForAll(accounts[0], iMarket.address), "market is not approved as operator for account 0");
  });

  it("should create 4 offers, tokenIds : 1, 2, 4, 5", async function () {
    await iMarket.setOffer(2000000, 1, { from: accounts[0] });
    await iMarket.setOffer(2000000, 2, { from: accounts[0] });
    await iMarket.setOffer(2000000, 4, { from: accounts[0] });
    await iMarket.setOffer(2000000, 5, { from: accounts[0] });
    let tokenOnSale = await iMarket.getAllTokenOnSale();

    console.log("TOKEN ON SALE :" + tokenOnSale);
    assert(tokenOnSale.length == 4, "should return 4 tokens on sale, got instead : " + tokenOnSale.length);
  });

  it("should buy tokenId: 1, 5 from account 0 by account 1", async function () {
    let tokenOnSale = await iMarket.getAllTokenOnSale();
    console.log("TOKEN ON SALE :" + tokenOnSale);

    console.log("BUYING 2 KITTIES...");
    await iMarket.buyKitty(1, { from: accounts[1], value: 2000000 });
    await iMarket.buyKitty(5, { from: accounts[1], value: 2000000 });

    let balance = await iMarket.getBalanceOf(accounts[0]);
    let kittiesOf0 = await iKitty.getKittiesOf(accounts[0]);
    let kittiesOf1 = await iKitty.getKittiesOf(accounts[1]);
    tokenOnSale = await iMarket.getAllTokenOnSale();

    console.log("TOKEN ON SALE :" + tokenOnSale);
    console.log("KITTIES OF ACCOUNT 0 :" + kittiesOf0);
    console.log("KITTIES OF ACCOUNT 1 :" + kittiesOf1);

    assert(balance.toNumber() == 4000000, "balance of account 0 should be 4000000, got instead : " + balance.toNumber());
    assert(kittiesOf0.length == 4, "account 0 should own 4 kitties, got instead : " + kittiesOf0.length);
    assert(kittiesOf1.length == 2, "account 1 should own 2 kitties, got instead : " + kittiesOf1.length);
  });

  it("should remove offer for tokenId 2", async function () {
    let tokenOnSale = await iMarket.getAllTokenOnSale();
    console.log("TOKEN ON SALE :" + tokenOnSale);

    console.log("REMOVING 1 OFFER...");
    await iMarket.removeOffer(2, { from: accounts[0] });

    tokenOnSale = await iMarket.getAllTokenOnSale();
    console.log("TOKEN ON SALE :" + tokenOnSale);

    assert(tokenOnSale.length == 1, "it should have one token on sale, got instead : " + tokenOnSale.length);
    assert(tokenOnSale[0] == 4, "the remaining token should be tokenId 4, got instead : " + tokenOnSale[0]);
  });

  it("should revert 'setOffer' cause market is not approved as operator for account 1", async function () {
    await truffleAssert.fails(iMarket.setOffer(2000000, 1, { from: accounts[1] }), truffleAssert.ErrorType.REVERT);
  });
  it("should revert 'buy action' cause tokenId 3 is not on sale", async function () {
    await truffleAssert.fails(iMarket.buyKitty(3, { from: accounts[2], value: 2000000 }), truffleAssert.ErrorType.REVERT);
  });
  it("should revert 'remove offer' cause account 2 is not owner", async function () {
    await truffleAssert.fails(iMarket.removeOffer(4, { from: accounts[2] }), truffleAssert.ErrorType.REVERT);
  });

  // await truffleAssert.passes(instance.function(params, {options}))
});