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

  console.log('Proxy wallet: ' + getContractAddress(ProxyWallet))

  console.log(proxyWalletContractInstance)

  let projectRegistryContract = web3.eth.contract(ProjectRegistry.abi)
  let projectRegistryContractInstance = projectRegistryContract.at(getContractAddress(ProjectRegistry))
  console.log(projectRegistryContractInstance)

  let registryTokenContract = web3.eth.contract(RegistryToken.abi)
  console.log(registryTokenContract)

  resolve({projectRegistryContractInstance, proxyWalletContractInstance})

  console.log(web3.eth.coinbase)

  proxyWalletContractInstance.getToken.call({from: web3.eth.coinbase}, (err, tokenAddress) => {
    console.log('Getting contracts')
    if (err) {
      console.log('ERRR')
      console.log(err)
      reject(err)
    } else {
      console.log('Token: ' + tokenAddress)
      let registryTokenContractInstance = registryTokenContract.at(tokenAddress)
      resolve({projectRegistryContractInstance, registryTokenContractInstance, proxyWalletContractInstance})
    }
  })
})

blockchainUtils.getProjects = async function (payload) {
  const promisifiedContract = Promise.promisifyAll(payload.registry)
  let projects = []
  const length = await promisifiedContract.getProjectsLengthAsync({from: web3.eth.coinbase})
  console.log('Length: ' + length)
  for (let i = 0; i < length; i++) {
    const project = await promisifiedContract.getProjectAsync(i, {from: web3.eth.coinbase})
    const votes = await promisifiedContract.getVotesAsync(i, payload.userAddress, {from: web3.eth.coinbase})
    projects.push(utils.convertProjectToObject(project, i, votes))
  }
  return projects
}

blockchainUtils.getTokenBalance = function (payload) {
  console.log(payload)
  return new Promise(function (resolve, reject) {
    let walletContractInstance = payload.wallet
    walletContractInstance.balanceOf.call(payload.userAddress, {from: payload.userAddress}, function (err, res) {
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
