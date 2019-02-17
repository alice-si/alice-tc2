import Web3 from 'web3'
import ProjectRegistry from '../../build/contracts/ProjectRegistry.json'
import ProxyWallet from '../../build/contracts/ProxyWallet.json'
import RegistryToken from '../../build/contracts/RegistryToken.json'
import Promise from 'bluebird'
import utils from './utils'

let blockchainUtils = {}
let web3 = new Web3(window.web3.currentProvider)

function getContractAddress (contractArtefact) {
  for (let key in contractArtefact.networks) {
    const address = contractArtefact.networks[key].address
    return address
  }
}

blockchainUtils.getContractsInstances = () => new Promise(function (resolve, reject) {
  let proxyWalletContract = web3.eth.contract(ProxyWallet.abi)
  let proxyWalletContractInstance = proxyWalletContract.at(getContractAddress(ProxyWallet))

  let projectRegistryContract = web3.eth.contract(ProjectRegistry.abi)
  let projectRegistryContractInstance = projectRegistryContract.at(getContractAddress(ProjectRegistry))

  let registryTokenContract = web3.eth.contract(RegistryToken.abi)
  proxyWalletContractInstance.getToken.call((err, tokenAddress) => {
    if (err) {
      reject(err)
    } else {
      let registryTokenContractInstance = registryTokenContract.at(tokenAddress)
      resolve({projectRegistryContractInstance, registryTokenContractInstance, proxyWalletContractInstance})
    }
  })
})

blockchainUtils.getProjects = async function (contract) {
  const promisifiedContract = Promise.promisifyAll(contract)
  let projects = []
  const length = await promisifiedContract.getProjectsLengthAsync()
  for (let i = 0; i < length; i++) {
    const project = await promisifiedContract.getProjectAsync(i)
    projects.push(utils.convertProjectToObject(project))
  }
  return projects
}

blockchainUtils.getTokenBalance = function (payload) {
  console.log(payload)
  return new Promise(function (resolve, reject) {
    let walletContractInstance = payload.wallet
    walletContractInstance.balanceOf.call(payload.userAddress, function (err, res) {
      if (err) {
        reject(err)
      } else {
        console.log(res)
        console.log(`Current balance for address: ${payload.userAddress} equals ${res}`)
        resolve(res)
      }
    })
  })
}

blockchainUtils.web3 = web3

export default blockchainUtils
