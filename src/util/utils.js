import blockchainUtils from './blockchainUtils'

let utils = {}

utils.convertNumberToStatus = function (num) {
  switch (num.toNumber()) {
    case 0:
      return 'APPLICATION'
    case 1:
      return 'ACTIVE'
    case 2:
      return 'CHALLENGE'
    case 3:
      return 'REJECTED'
    default:
      return 'UNKNOWN STATUS'
  }
}

utils.convertProjectToObject = function (project) {
  return {
    name: blockchainUtils.web3.toAscii(project[0]),
    status: utils.convertNumberToStatus(project[1]),
    yesTotal: project[2],
    noTotal: project[3]
  }
}

// TODO alex consider removing of it
// utils.getProjectField = (project, name) => {
//     switch (name) {
//         case 'name':
//             return project[0]
//         case 'status':
//             return project[1]
//         case 'yesTotal':
//             return project[2]
//         case 'noTotal':
//             return project[3]
//         default:
//             throw "Trying to get bad project field"
//     }
// }

export default utils
