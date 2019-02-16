import Promise from 'bluebird'
import Web3 from 'web3'

async function getProjects (contract) {
  let web3 = new Web3(window.web3.currentProvider)
  const promisifiedContract = Promise.promisifyAll(contract)
  let projects = []
  const length = await promisifiedContract.getProjectsLengthAsync()
  for (let i = 0; i < length; i++) {
    const project = await promisifiedContract.getProjectNameAsync(i)
    projects.push(web3.toAscii(project))
  }
  return projects
}

export default getProjects
