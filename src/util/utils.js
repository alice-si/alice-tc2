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

utils.convertProjectToObject = function (project, i, votes) {
  let canVote = !votes || (votes[0].toNumber() === 0 && votes[1].toNumber() === 0)
  return {
    name: blockchainUtils.web3.toAscii(project[0]),
    status: utils.convertNumberToStatus(project[1]),
    yesTotal: project[2],
    noTotal: project[3],
    id: i,
    canVote
  }
}

export default utils
