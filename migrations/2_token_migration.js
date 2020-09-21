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



    //tests : 

    let kittyproxy = await KittyProxy.deployed()
    let kitty = await KittyToken.at(kittyproxy.address);
await kitty.initialize();////////////NE PAS OUBLIER!!!!

    let supply = await kitty.totalSupply();
    console.log(supply.toString());
    let supply2 = await instance.totalSupply();
    console.log(supply2.toString());
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
};
