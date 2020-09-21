//const BigNumber = require('bignumber.js');

//DUE TO VARIABLES VISIBILITY SET TO PRIVATE NO MORE TESTABLE

const KittyToken = artifacts.require("KittyContract"); //build json name
const KittyProxy = artifacts.require("KittyProxy"); 
const KittyMarket = artifacts.require("KittyMarketContract");
const KittyMarketProxy = artifacts.require("KittyMarketProxy");

const Float_MIN = 1e-10;
//mocha mise en commentaire runner.js l846

//compile => solidity / migrate =>js / develop-ganache/console test
//Attention pour test : fichier deploy partie test
//et mettre fonction public pour tester
//contract('CoinflipMain', async function(accounts) {
contract('KittyProxy', async function(accounts) {

  let cKitty, pKitty, iKitty, cMarket, pMarket, iMarket;

  let option1 = {value : web3.utils.toWei("1", "ether")};
  let option2 = {value : web3.utils.toWei("1", "ether")};
  let option3 = {from : accounts[0]};
  let option4 = {from : accounts[1]};
  let option5 = {from : accounts[2]};
  let option6 = {from : accounts[0], value : web3.utils.toWei("1", "ether")};
  let option7 = {from : accounts[1], value : web3.utils.toWei("1", "ether")};
  let option8 = {from : accounts[2], value : web3.utils.toWei("1", "ether")};
  let option9 = {from : accounts[0], value : web3.utils.toWei("5", "ether")};


  before(async function() {
    pKitty = await KittyProxy.deployed()
    iKitty = await KittyToken.at(pKitty.address);

    pMarket = await KittyMarketProxy.deployed()
    iMarket = await KittyMarket.at(pMarket.address);
  });


  it("should initialize KittyContract correctly", async function() {
    let supply = await iKitty.totalSupply();  
    console.log("SUPPLY : " + supply.toString());
    assert(supply.toNumber() == 7);//, "paused should be false"); ACHANGER QD VIRER DE MIGRATION
  });
  it("should create 3 kitty gen0", async function() {
    await iKitty.createKittyGen0(1234567891234567);
    await iKitty.createKittyGen0(1111111111111111);
    await iKitty.createKittyGen0(5555555555555555);
    let result = await iKitty.balanceOf(accounts[0]);

    console.log("LENGHT : " + result.toNumber());
    assert(result.toNumber() == 9);//, "paused should be false");10-1 vendu
  });
  it("should set Market as operator of account 0", async function() {
    await iKitty.setApprovalForAll(iMarket.address, true, {from: accounts[0]});

    assert(iKitty.isApprovedForAll(accounts[0],iMarket.address));//, "paused should be false");10-1 vendu
  });

  it("should create 2 offers", async function() {
    await iMarket.setOffer(2000000, 1, {from: accounts[0]});
    await iMarket.setOffer(2000000, 3, {from: accounts[0]});
    let tokenOnSale = await iMarket.getAllTokenOnSale();


    console.log("LENGHT : " + tokenOnSale);
    assert(tokenOnSale.length == 4, "should retunr 2, got instead : " + tokenOnSale.length);//, "paused should be false");10-1 vendu
  });
  it("should buy 1 kitty from 0 to 1", async function() {
    await iMarket.buyKitty(1, {from: accounts[1], value: 2000000});
    let balance = await iMarket.getBalanceOf(accounts[0]);
    let userKitties = await iKitty.getKittiesOf(accounts[1]);
    console.log(balance.toNumber(), userKitties[0].toNumber(),userKitties.length
    );


    assert(balance.toNumber() == 4000000 && userKitties.length == 2, "should retunr 2, got instead : ");//, "paused should be false");10-1 vendu
  });

});