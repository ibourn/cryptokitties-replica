const KittyToken = artifacts.require("KittyContract"); //build json name
const KittyProxy = artifacts.require("KittyProxy"); 
const KittyRental = artifacts.require("KittyRentalContract");
const RentalFactory = artifacts.require("KittyRentalFactory"); 

module.exports = async function(deployer, networks, accounts) {

  let instanceOfRental, instanceOfFactory, instance;

  /*1 deployement of master contract*/
  console.log("**\n ==> Deployment of KittyRental **\n");
  await deployer.deploy(KittyRental, {from : accounts[0]}); //mettre add proxy ou kitty token? pour

  /*2 get the address of the contract*/
  instanceOfRental = await KittyRental.deployed();
  console.log("KittyRental address : " + instanceOfRental.address);

  /*3 deployment of factory with the address of the main contract as parameter*/
  await deployer.deploy(RentalFactory, {from : accounts[0]});
  instanceOfFactory = await RentalFactory.deployed();
  console.log("RentalFactory address : " + instanceOfFactory.address);

  /*4 set KittyContract and master RentalContract addresses*/
//   instance = await KittyMarket.at(instanceOfProxy.address);
//   console.log(instance);
let a = await KittyProxy.deployed();
let b = await KittyRental.deployed();
  console.log("ADDRESSESS", b.address, a.address,KittyRental.address, KittyProxy.address);

  await instanceOfFactory.initialize(b.address, a.address);////////////NE PAS OUBLIER!!!!

}