const KittyToken = artifacts.require("KittyContract"); //build json name
const KittyProxy = artifacts.require("KittyProxy"); 
const KittyMarket = artifacts.require("KittyMarketContract");
const KittyMarketProxy = artifacts.require("KittyMarketProxy"); 
const KittyRental = artifacts.require("KittyRentalContract");
const RentalFactory = artifacts.require("KittyRentalFactory"); 


module.exports = async function(deployer, networks, accounts) {

  let instanceOfLogic, instanceOfProxy, instanceOfFactory, market;

  /*1 deployement of contract*/
  console.log("***\n ==> Deployment of KittyMarket via KittyMarketProxy... \n***");
  await deployer.deploy(KittyMarket, KittyProxy.address, {from : accounts[0]}); //mettre add proxy ou kitty token? pour

  /*2 get the address of the contract*/
  instanceOfLogic = await KittyMarket.deployed();
  console.log("***\n ==> KittyMarket address : " + instanceOfLogic.address + "\n***");

  /*3 deployment of proxy with the address of the main contract as parameter*/
  await deployer.deploy(KittyMarketProxy, instanceOfLogic.address, {from : accounts[0]});
  instanceOfProxy = await KittyMarketProxy.deployed();
  console.log("***\n ==> KittyMarketProxy address : " + instanceOfProxy.address + "\n***");
 
  /*4 set KittyMarket at proxy's address to access its functions (via 'instance')*/
  market = await KittyMarket.at(instanceOfProxy.address);
  console.log("***\n ==> Instance of KittyMarket set at Proxy address : " + market + "\n***");

/*5 initialization of the instance of market contract (via proxy)*/
  await market.initialize(KittyProxy.address, RentalFactory.address);
  console.log("***\n ==> instance of market initialized with KittyProxy and RentalFactory addresses : " + market + "\n***");


  //************************************************************************  //************************************************************************
  //MEMO // let instanceOfKittyProxy = await KittyProxy.deployed();
  //MEMO // let instanceOfKittyUsed = await KittyToken.at(KittyProxy.address);
  //MEMO // let instanceOfFactory = await RentalFactory.deployed();
  //MEMO instanceOfKittyUsed.address == instanceOfKittyProxy.address == KittyProxy.address
  //MEMO instanceOfFactory.address == RentalFactory.address // idem market.addres s== KittyMarketProxy.address

  let kitty = await KittyToken.at(KittyProxy.address);
await kitty.setApprovalForAll(market.address, true, {from: accounts[0]});
console.log("***\n TEST f/setApproval : set market as approved operator for account 0 \n***");

await market.setOffer(2000000, 1, {from: accounts[0]});
await market.setOffer(2000000, 2, {from: accounts[0]});
await market.setOffer(2000000, 3, {from: accounts[0]});
await market.setOffer(2000000, 5, {from: accounts[0]});
let tokensOnSale = await market.getAllTokenOnSale();
console.log("***\n TEST\n" +
 " f/setOffer : 4 offers from account 0 for tokens 1, 2, 3, 5 at 2000000" +
 "\n f/getAllTokenOnSale : result : " + tokensOnSale.toString() + "\n***");

 let balance = await market.getBalanceOf(accounts[0]);
 let kittiesOfacc0 = await kitty.getKittiesOf(accounts[0]);
 console.log("***\n TEST\ account 0 : balance : " + balance.toNumber() +" / list of tokens : " + kittiesOfacc0 + "\n***");

 await market.buyKitty(2, {from: accounts[1], value: 2000000});
 await market.buyKitty(3, {from: accounts[1], value: 2000000});
 console.log("***\n TEST f/buyKitty : account 1 buy tokens 2 and 3 for 2000000 \n***");

 balance = await market.getBalanceOf(accounts[0]);
kittiesOfacc0 = await kitty.getKittiesOf(accounts[0]);
 console.log("***\n TEST\ account 0 : balance : " + balance.toNumber() +" / list of tokens : " + kittiesOfacc0 + "\n***");
balance = await market.getBalanceOf(accounts[1]);
let kittiesOfacc1 = await kitty.getKittiesOf(accounts[1]);
console.log("***\n TEST\ account 1 : balance : " + balance.toNumber() +" / list of tokens : " + kittiesOfacc1 + "\n***");

await kitty.setApprovalForAll(market.address, true, {from: accounts[1]});
await market.setOffer(4000000, 2, {from: accounts[1]});
console.log("***\n TEST account 1 approved market as operator and set an offer : token 2 for 4000000\n***");

await market.buyKitty(5, {from: accounts[2], value: 2000000});
await market.buyKitty(2, {from: accounts[2], value: 4000000});
console.log("***\n TEST f/buyKitty : account 2 buy token 2 from acc1 and 5 from acc0 \n***");

tokensOnSale = await market.getAllTokenOnSale();
kittiesOfacc0 = await kitty.getKittiesOf(accounts[0]);
balance = await market.getBalanceOf(accounts[0]);
kittiesOfacc1 = await kitty.getKittiesOf(accounts[1]);
let balance1 = await market.getBalanceOf(accounts[1]);
let kittiesOfacc2 = await kitty.getKittiesOf(accounts[2]);
let balance2 = await market.getBalanceOf(accounts[2]);
console.log("***\n TEST result of buy actions :" +
"\n acc0 sold 3 tokens, acc1 bought 2 at 2000000 and sold 1 at 4000000, acc2 bought 1 at 2000000" +
"\nacount 0 : balance : " + balance + " / list of token : " + kittiesOfacc0 +
"\nacount 1 : balance : " + balance1 + " / list of token : " + kittiesOfacc1 +
"\nacount 2 : balance : " + balance2 + " / list of token : " + kittiesOfacc2 +
"\ntokens on sale : " + tokensOnSale +"\n***");







//  tokensOnSale = await market.getAllTokenOnSale();



// await kitty.setApprovalForAll(marketproxy.address, true, {from: accounts[1]});
await market.setRentalOffer(accounts[0], 1, 1, 2000000, {from: accounts[0]});
await market.setRentalOffer(accounts[0], 4, 1, 2000000, {from: accounts[0]});
await kitty.setApprovalForAll(market.address, true, {from: accounts[2]});
await market.setRentalOffer(accounts[2], 2, 1, 2000000, {from: accounts[2]});
let allTokensOnRent = await market.getAllTokenOnRent();
console.log("***\n TEST rent actions :" +
"\naccount 0 set rental offers for tokens : 1, 4 / account  2 for token : 2" +
"\nf/getAllTokenOnRent result : " + allTokensOnRent[0] + "\n***");

await market.takeRentalOffer(2, accounts[1], {from: accounts[1], value: 2000000});
await market.takeRentalOffer(4, accounts[1], {from: accounts[1], value: 2000000});
allTokensOnRent = await market.getAllTokenOnRent();
console.log("***\n TEST" +
"\nf/takeRentalOffer account 1 take offers for tokens : 2, 4" +
"\nf/getAllTokenOnRent result : " + allTokensOnRent.toString() + "\n***");

let rentalContractAddOfToken2 = await market.getContractOfToken(2);
await kitty.approve(rentalContractAddOfToken2, 3, {from: accounts[1]});

let rentInstance = await KittyRental.at(rentalContractAddOfToken2);

await rentInstance.consumeAction(2, 3, {from: accounts[1]});
};