import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import getWeb3 from '../util/getWeb3'
import blockchainUtils from '../util/blockchainUtils'
import pollWeb3 from '../util/pollWeb3'

Vue.use(Vuex)

function syncWithContracts ({commit, dispatch}) {
  if (state.getContractInstance) {
    console.log('Syncing with blockchain')
    dispatch('updateProjects', {
      registry: state.getContractInstance('registry'),
      userAddress: state.web3.coinbase
    })
    dispatch('updateTokenBalance', {
      wallet: state.getContractInstance('wallet'),
      userAddress: state.web3.coinbase
    })
  } else {
    console.log('State doesnt contain contractInstance. Retrying in 3 sec...')
    setTimeout(() => {
      dispatch('syncWithContracts')
    }, 3000)
  }
}

export const store = new Vuex.Store({
  strict: true,
  state,
  mutations: {
    registerWeb3Instance (state, payload) {
      console.log('registerWeb3instance Mutation being executed', payload)
      let result = payload
      let web3Copy = state.web3
      web3Copy.coinbase = result.coinbase
      web3Copy.networkId = result.networkId
      web3Copy.balance = parseInt(result.balance, 10)
      web3Copy.isInjected = result.injectedWeb3
      web3Copy.web3Instance = result.web3
      state.web3 = web3Copy
      pollWeb3()
    },
    pollWeb3Instance (state, payload) {
      console.log('pollWeb3Instance mutation being executed', payload)
      state.web3.coinbase = payload.coinbase
      state.web3.balance = parseInt(payload.balance, 10)
    },
    registerContractsInstances (state, payload) {
      state.getContractInstance = (name) => {
        if (name === 'token') {
          return payload.registryTokenContractInstance
        } else if (name === 'wallet') {
          return payload.proxyWalletContractInstance
        } else {
          return payload.projectRegistryContractInstance
        }
      }
    },
    updateProjects (state, payload) {
      console.log('Updating projects')
      payload.forEach(function (project) {
        console.log(project)
        let total = project.yesTotal.add(project.noTotal)
        if (total > 0) {
          project.ratio = project.yesTotal.mul(100).div(total)
        } else {
          project.ratio = 0
        }
        console.log(project.name + ' Ratio: ' + project.ratio)
      })

      state.projects = payload
    },
    updateTokenBalance (state, payload) {
      console.log('Updating token balance')
      state.tokenBalance = payload
    }
  },
  actions: {
    registerWeb3 ({commit}) {
      console.log('registerWeb3 Action being executed')
      getWeb3.then(result => {
        console.log('committing result to registerWeb3Instance mutation')
        commit('registerWeb3Instance', result)
      }).catch(e => {
        console.log('error in action registerWeb3', e)
      })
    },
    pollWeb3 ({commit}, payload) {
      console.log('pollWeb3 action being executed')
      commit('pollWeb3Instance', payload)
    },
    getContractsInstances ({commit}) {
      blockchainUtils.getContractsInstances().then(result => {
        commit('registerContractsInstances', result)
      }).catch(e => console.log(e))
    },
    updateProjects ({commit}, payload) {
      blockchainUtils.getProjects(payload).then(result => {
        commit('updateProjects', result)
      }).catch(e => console.log(e))
    },
    updateTokenBalance ({commit}, payload) {
      blockchainUtils.getTokenBalance(payload).then(result => {
        commit('updateTokenBalance', result)
      }).catch(e => console.log(e))
    },
    syncWithContracts
  }
})
