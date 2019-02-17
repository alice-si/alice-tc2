require('dotenv').config();
const HDWalletProvider = require('truffle-hdwallet-provider');

module.exports = {
  networks: {
    poa: {
      provider: function() {
        return new HDWalletProvider(
          process.env.MNEMONIC,
          "https://sokol.poa.network")
      },
      network_id: 77,
      gas: 500000,
      gasPrice: 1000000000
    },
    development: {
      host: "localhost",
      port: 8545,
      gas: 500000,
      network_id: "*" // Match any network id
    }
  }
};
