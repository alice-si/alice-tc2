import ProjectRegistry from '../../../build/contracts/ProjectRegistry.json'

const ABI = ProjectRegistry.abi
const address = ProjectRegistry.networks[3].address

export { ABI, address }
