const KittyToken = artifacts.require("KittyContract"); //build json name
const KittyProxy = artifacts.require("KittyProxy");

module.exports = async function (deployer, networks, accounts) {

  let instanceOfLogic, instanceOfProxy, instance;

  /*1 deployement of contract*/
  console.log("***\n ==> Deployment of KittyContract via KittyProxy... \n***");
  await deployer.deploy(KittyToken, { from: accounts[0] });

  /*2 get the address of the contract*/
  instanceOfLogic = await KittyToken.deployed();
  console.log("***\n ==> KittyContract address : " + instanceOfLogic.address + "\n***");

  /*3 deployment of proxy with the address of the main contract as parameter*/
  await deployer.deploy(KittyProxy, instanceOfLogic.address, { from: accounts[0] });
  instanceOfProxy = await KittyProxy.deployed();
  console.log("***\n ==> KittyProxy address : " + instanceOfProxy.address + "\n***");

  /*4 set KittyContract at proxy's address to access its functions (via 'instance')*/
  instance = await KittyToken.at(instanceOfProxy.address);
  console.log("***\n ==> Instance of KittyContract set at Proxy address : " + instance + "\n***");
 
  /*5 initialization of the instance of kitty contract (via proxy)*/
  await instance.initialize();
  console.log("***\n ==> Instance of kitty contract initialized \n***");

  // //************************************************************************
  // //tests : COMMENT THIS SECTION TO RUN TRUFFLE TESTS / UNCOMMENT TO TEST AT MIGRATION
  // //************************************************************************
  // let supply = await instance.totalSupply();
  // console.log("***\n TEST : supply at launched : " + supply.toString() + "\n***");
  // let resultAtLaunch = await instance.getKittiesOf(accounts[0]);
  // console.log("***\n TEST : list of token for acc0 at launched : " + resultAtLaunch.toString() + "\n***");

  // await instance.createKittyGen0(1234567891234567);
  // await instance.createKittyGen0(1111111111111111);
  // await instance.createKittyGen0(5555555555555555);
  // await instance.createKittyGen0(4444444444444444);
  // await instance.createKittyGen0(7777777777777777);
  // let result = await instance.getKittiesOf(accounts[0]);
  // supply = await instance.totalSupply();
  // console.log("***\n TEST : supply after 5 creations : " + supply.toString() + "\n***");
  // console.log("***\n TEST : list of token for acc0 after gen0 creation : " + result.toString() + "\n***");

  // let kitty1 = await instance.getKitty(0);
  // let kitty2 = await instance.getKitty(1);
  // let kitty3 = await instance.getKitty(2);
  // let kitty4 = await instance.getKitty(3);
  // let kitty5 = await instance.getKitty(4);
  // // let kitty6 = await instance.getKitty(5);

  // console.log("***\n TEST : kitties created : " + 
  // "\nkitty 0 : " + kitty1 + "\nkitty0 genes : " + kitty1.genes.toString() +
  // "\nkitty 1 : " + kitty2 + "\nkitty1 genes : " + kitty2.genes.toString() +
  // "\nkitty 2 : " + kitty3 + "\nkitty2 genes : " + kitty3.genes.toString() +
  // "\nkitty 3 : " + kitty4 + "\nkitty3 genes : " + kitty4.genes.toString() +
  // "\nkitty 4 : " + kitty4 + "\nkitty4 genes : " + kitty5.genes.toString() +
  // "\n***");

};
