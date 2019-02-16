import Web3 from 'web3'
import {address, ABI} from './constants/projectRegistryContract'

let getContract = new Promise(function (resolve, reject) {
  let web3 = new Web3(window.web3.currentProvider)
  let projectRegistryContract = web3.eth.contract(ABI)
  let projectRegistryContractInstance = projectRegistryContract.at(address)
  console.log(projectRegistryContractInstance)
  resolve(projectRegistryContractInstance)
})

export default getContract
