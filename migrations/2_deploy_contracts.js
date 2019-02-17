var RegistryToken = artifacts.require("./RegistryToken.sol");
var ProjectRegistry = artifacts.require("./ProjectRegistry.sol");
var ProxyWallet = artifacts.require("./ProxyWallet.sol");

let deposit = web3.utils.toWei('10', 'ether');

module.exports = function(deployer) {
  deployer.deploy(ProxyWallet, {gas: 5000000}).then(function(instance) {
    return deployer.deploy(ProjectRegistry, deposit, instance.address, {gas: 5000000});
  });

};
