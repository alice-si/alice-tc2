<template>
  <md-card>
    <md-card-header>
      <div class='md-title'>Registry token</div>
    </md-card-header>

    <md-card-content>
      <p>My address: {{ web3.coinbase }}</p>
      <p>Balance: {{ tokenBalance }}</p>
    </md-card-content>

    <md-button class='md-raised md-primary' v-on:click='mintTokens()'>Mint</md-button>
  </md-card>
</template>

<script>
import blockchainUtils from '../util/blockchainUtils'

export default {
  name: 'balance',
  computed: {
    tokenBalance () {
      return this.$store.state.tokenBalance
    },
    web3 () {
      return this.$store.state.web3
    }
  },
  methods: {
    mintTokens () {
      console.log('Trying to mint tokens')
      let contractInstance = this.$store.state.getContractInstance('wallet')
      const amountToMint = blockchainUtils.web3.toWei('20', 'ether')
      contractInstance.mintTokens(amountToMint, {
        gas: 300000,
        from: this.$store.state.web3.coinbase
      }, (err, result) => {
        if (err) {
          console.log(err)
        } else {
          console.log('Event watching started')
          let transfer = this.$store.state.getContractInstance('token').Transfer()
          transfer.watch((err, res) => {
            if (err) {
              console.log(err)
            }
            this.$store.dispatch('syncWithContracts')
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.md-card {
  width: 500px;
  margin: 4px;
  display: inline-block;
  vertical-align: top;
}
p {
  margin: 0px;
  padding: 0px;
}
</style>
