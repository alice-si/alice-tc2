import Web3 from 'web3'
import registryContract from './constants/projectRegistryContract'
import tokenContract from './constants/registryTokenContract'
import Promise from 'bluebird'

let blockchainUtils = {}
let web3 = new Web3(window.web3.currentProvider)

blockchainUtils.getContractsInstances = () => new Promise(function (resolve, reject) {
  let projectRegistryContract = web3.eth.contract(registryContract.ABI)
  let projectRegistryContractInstance = projectRegistryContract.at(registryContract.address)
  let registryTokenContract = web3.eth.contract(tokenContract.ABI)
  projectRegistryContractInstance.token.call((err, tokenAddress) => {
    if (err) {
      reject(err)
    } else {
      let registryTokenContractInstance = registryTokenContract.at(tokenAddress)
      resolve({projectRegistryContractInstance, registryTokenContractInstance})
    }
  })
})

blockchainUtils.getProjects = async function (contract) {
  const promisifiedContract = Promise.promisifyAll(contract)
  let projects = []
  const length = await promisifiedContract.getProjectsLengthAsync()
  for (let i = 0; i < length; i++) {
    const project = await promisifiedContract.getProjectNameAsync(i)
    projects.push(web3.toAscii(project))
  }
  return projects
}

blockchainUtils.getTokenBalance = function (payload) {
  console.log(payload)
  return new Promise(function (resolve, reject) {
    let tokenContractInstance = payload.token
    tokenContractInstance.balanceOf.call(payload.userAddress, function (err, res) {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

blockchainUtils.web3 = web3

export default blockchainUtils
