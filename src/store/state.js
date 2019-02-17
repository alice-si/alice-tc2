let state = {
  web3: {
    isInjected: false,
    web3Instance: null,
    networkId: null,
    coinbase: null,
    balance: null,
    error: null
  },
  getContractInstance: null,
  projects: [],
  tokenBalance: null
}
export default state
