<template>
  <md-card>
    <md-card-header>
      <div class="md-title">Network</div>
    </md-card-header>

    <md-card-content>
      <p>Metamask: {{ web3.isInjected }}</p>
      <p>Network: {{ web3.networkId }}</p>
      <p>Account: {{ web3.coinbase }}</p>
      <p>Balance: {{ web3.balance }}</p>
    </md-card-content>
  </md-card>
</template>

<script>
  export default {
    name: 'metamask',
    computed: {
      web3 () {
        return this.$store.state.web3
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
