const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://142.93.85.174:8102"));
var ProxyWallet = require('./build/contracts/ProxyWallet.json');

web3.version.getNetwork(function(err, res) {
  console.log(res);
});

let proxyWalletContract = web3.eth.contract(ProxyWallet.abi);
let proxyWalletContractInstance = proxyWalletContract.at("0x975698015E8Fc4Cf2aE794af65A472D6FC9B702e");

console.log(proxyWalletContractInstance)

proxyWalletContractInstance.getToken.call((err, tokenAddress) => {
  console.log('Getting contracts')
  if (err) {
    console.log('ERRR')
    console.log(err)

  } else {
    console.log('Token: ' + tokenAddress)

  }
})
