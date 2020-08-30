const KittyToken = artifacts.require("KittyContract"); //build json name
const KittyProxy = artifacts.require("KittyProxy"); 

module.exports = async function(deployer, networks, accounts) {

  let instanceOfLogic, instanceOfProxy, instance;

  /*1 deployement of contract*/
  console.log("Deployment of KittyContract via KittyProxy...");
  await deployer.deploy(KittyToken, {from : accounts[0]});

  /*2 get the address of the contract*/
  instanceOfLogic = await KittyToken.deployed();
  console.log("KittyContract address : " + instanceOfLogic.address);

  /*3 deployment of proxy with the address of the main contract as parameter*/
  await deployer.deploy(KittyProxy, instanceOfLogic.address, {from : accounts[0]});
  instanceOfProxy = await KittyProxy.deployed();
  console.log("KittyProxy address : " + instanceOfProxy.address);

  /*4 set KittyContract at proxy's address to access its functions (via 'instance')*/
  instance = await KittyToken.at(instanceOfProxy.address);
  console.log(instance);
};
