const KittyProxy = artifacts.require("KittyProxy"); 
const KittyRental = artifacts.require("KittyRentalContract");
const RentalFactory = artifacts.require("KittyRentalFactory"); 

module.exports = async function(deployer, networks, accounts) {

  let instanceOfRental, instanceOfFactory, instance;

  /*1 deployement of master contract of clones*/
  console.log("***\n ==> Deployment of Rental Contract \n***");
  await deployer.deploy(KittyRental, {from : accounts[0]});

  /*2 get the address of the contract*/
  instanceOfRental = await KittyRental.deployed();
  console.log("***\n ==> KittyRental address (master contract of clones): " + instanceOfRental.address + "\n***");

  /*3 deployment of the factory*/
  await deployer.deploy(RentalFactory, {from : accounts[0]});
  instanceOfFactory = await RentalFactory.deployed();
  console.log("***\n ==> RentalFactory address : " + instanceOfFactory.address + "\n***");

  /*4 initialiaztion : set KittyContract and master RentalContract addresses*/
  await instanceOfFactory.initialize(KittyRental.address, KittyProxy.address);
  console.log("***\n ==> Factory initialized with KittyContract and RentalContract addresses : " + instanceOfFactory + "\n***");

}