const KittyToken = artifacts.require("Kittycontract"); //build json name 

module.exports = function(deployer) {
  deployer.deploy(KittyToken);
};
