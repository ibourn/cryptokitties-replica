//const BigNumber = require('bignumber.js');
const KittyToken = artifacts.require("KittyContract"); //build json name
const KittyProxy = artifacts.require("KittyProxy"); 
const KittyMarket = artifacts.require("KittyMarketContract");
const KittyMarketProxy = artifacts.require("KittyMarketProxy"); 
const KittyRental = artifacts.require("KittyRentalContract");
const RentalFactory = artifacts.require("KittyRentalFactory"); 

const Float_MIN = 1e-10;
//mocha mise en commentaire runner.js l846

contract('KittyProxy', async function(accounts) {

  before(async function() {
    pKitty = await KittyProxy.deployed()
    iKitty = await KittyToken.at(pKitty.address);

    // pMarket = await KittyMarketProxy.deployed()
    // iMarket = await KittyMarket.at(pMarket.address);
  });


  it("should initialize KittyContract correctly", async function() {
    let supply = await iKitty.totalSupply();  
    console.log("SUPPLY (token 0 created at initialization) : " + supply.toString());
    assert(supply.toNumber() == 1);
  });

  it("should create 3 kitty gen0", async function() {
    await iKitty.createKittyGen0(1234567891234567);
    await iKitty.createKittyGen0(1111111111111111);
    await iKitty.createKittyGen0(5555555555555555);
    let balance = await iKitty.balanceOf(accounts[0]);

    console.log("BALANCE (init + createGen0) : " + balance.toNumber());
    assert(balance.toNumber() == 4);
  });

});