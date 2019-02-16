var ProjectRegistry = artifacts.require("./ProjectRegistry.sol");

let deposit = web3.utils.toWei('10', 'ether');

module.exports = function(deployer) {
  deployer.deploy(ProjectRegistry, deposit, {gas: 5000000});
};
