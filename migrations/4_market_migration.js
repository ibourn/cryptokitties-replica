const KittyToken = artifacts.require("KittyContract"); //build json name
const KittyProxy = artifacts.require("KittyProxy"); 
const KittyMarket = artifacts.require("KittyMarketContract");
const KittyMarketProxy = artifacts.require("KittyMarketProxy"); 
const KittyRental = artifacts.require("KittyRentalContract");
const RentalFactory = artifacts.require("KittyRentalFactory"); 


module.exports = async function(deployer, networks, accounts) {

  let instanceOfLogic, instanceOfProxy, instanceOfFactory, instance;

  /*1 deployement of contract*/
  console.log("Deployment of KittyMarket via KittyMarketProxy...");
  await deployer.deploy(KittyMarket, KittyProxy.address, {from : accounts[0]}); //mettre add proxy ou kitty token? pour

  /*2 get the address of the contract*/
  instanceOfLogic = await KittyMarket.deployed();
  console.log("KittyMarket address : " + instanceOfLogic.address);

  /*3 deployment of proxy with the address of the main contract as parameter*/
  await deployer.deploy(KittyMarketProxy, instanceOfLogic.address, {from : accounts[0]});
  instanceOfProxy = await KittyMarketProxy.deployed();
  console.log("KittyMarketProxy address : " + instanceOfProxy.address);

  /*4 set KittyContract at proxy's address to access its functions (via 'instance')*/
  instance = await KittyMarket.at(instanceOfProxy.address);
  console.log(instance);
  instanceOfFactory = await RentalFactory.deployed();
  console.log("FACTORY ADDRESSES ",instanceOfFactory.address, RentalFactory.address);
  await instance.initialize(KittyProxy.address,RentalFactory.address);////////////NE PAS OUBLIER!!!!
//???
 //instanceofproxy

  //tests : 

  let kittyproxy = await KittyProxy.deployed()
    let kitty = await KittyToken.at(kittyproxy.address);


    let supply = await kitty.totalSupply();
    console.log(supply.toString());
    let resultAtLaunch = await kitty.getKittiesOf(accounts[0]);
    console.log(resultAtLaunch.toString());

    await kitty.createKittyGen0(1234567891234567);
    await kitty.createKittyGen0(1111111111111111);
    await kitty.createKittyGen0(5555555555555555);
    let result = await kitty.getKittiesOf(accounts[0]);
    console.log(result.toString());

let kitty1 = await kitty.getKitty(0);
let kitty2 = await kitty.getKitty(1);
let kitty3 = await kitty.getKitty(2);
// let kitty4 = await kitty.getKitty(3);

console.log(kitty1, kitty1.genes.toString(),kitty2, kitty2.genes.toString(),kitty3, kitty3.genes.toString());

let marketproxy = await KittyMarketProxy.deployed()
let market = await KittyMarket.at(marketproxy.address);
console.log("market instance add : " + market.address + " marketproxy add : " + marketproxy.address);
//les memes
await kitty.setApprovalForAll(marketproxy.address, true, {from: accounts[0]});
    //surement probleme add this de setOffer =>proxy ou pas?);
    //ou le _owns qui passe par appel de kittycontract...? proxy? ou contrat?
await market.setOffer(2000000, 2, {from: accounts[0]});
await market.setOffer(2000000, 4, {from: accounts[0]});
let tokenOnSale = await market.getAllTokenOnSale();

console.log(tokenOnSale.toString());

await market.buyKitty(2, {from: accounts[1], value: 2000000});
let balance = await market.getBalanceOf(accounts[0]);
let userKitties = await kitty.getKittiesOf(accounts[1]);
console.log(balance.toNumber(), userKitties[0].toNumber()
);

};