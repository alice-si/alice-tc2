<template>
  <div class="page-container">

    <metamask></metamask>

    <md-app>
      <md-app-toolbar class="md-primary">
        <span class="md-title">Social projects</span>
      </md-app-toolbar>

      <md-app-content>
        <router-view></router-view>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
import Metamask from '@/components/Metamask'

export default {
  name: 'app',
  beforeCreate () {
    console.log('registerWeb3 Action dispatched from App.vue')
    this.$store.dispatch('registerWeb3')
  },
  components: {
    'metamask': Metamask
  }
}
</script>

<style lang="scss" scoped>

  .page-container {
    margin: 10px;
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
</style>
