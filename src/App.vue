<template>
  <div class="page-container">

    <div class="md-layout">
      <div class="md-layout-item md-size-70">
        <md-app>
          <md-app-toolbar class="md-primary">
            <span class="md-title">Social projects</span>
            <a id="refresh-button" v-on:click='refreshApp()'><md-icon  class="md-primary">refresh</md-icon></a>
          </md-app-toolbar>

          <md-app-content>
            <router-view></router-view>
          </md-app-content>
        </md-app>
      </div>


      <div class="md-layout-item md-size-30">
        <metamask></metamask>
        <balance></balance>
      </div>
    </div>


  </div>
</template>

<script>
import Metamask from '@/components/Metamask'
import Balance from '@/components/Balance'

const easyUpdateEnabled = true

export default {
  name: 'app',
  beforeCreate () {
    console.log('registerWeb3 Action dispatched from App.vue')
    this.$store.dispatch('registerWeb3')
    if (easyUpdateEnabled) {
      let app = this
      setInterval(function () {
        console.log('Dispatching syncWithContracts... Next dispatch in 5 seconds')
        app.$store.dispatch('syncWithContracts')
      }, 5000)
    }
  },
  methods: {
    refreshApp () {
      this.$store.dispatch('syncWithContracts')
    }
  },
  components: {
    'metamask': Metamask,
    'balance': Balance
  }
}
</script>

<style lang="scss" scoped>

  .page-container {
    margin: 20px;
  }

  .md-app {
    min-height: 350px;
    border: 1px solid rgba(#000, .12);
  }

  // Demo purposes only
  .md-drawer {
    width: 230px;
    max-width: calc(100vw - 125px);
  }

  #refresh-button {
    cursor: pointer;
    position: absolute;
    right: 30px;
  }
</style>
