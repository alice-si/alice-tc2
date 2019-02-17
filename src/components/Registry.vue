<template>
<div>

  <md-list>
    <md-list-item v-for='project in projects'>
      <md-avatar>
        <img src="https://placeimg.com/40/40/people/5" alt="Image">
      </md-avatar>

      <span class="md-list-item-text">{{ project }}</span>

      <md-button class="md-icon-button md-list-action">
        <md-icon class="md-primary">close</md-icon>
      </md-button>
    </md-list-item>
  </md-list>

  <md-field>
      <label>Project name</label>
      <md-input v-model="projectName"></md-input>
  </md-field>
  <md-button class="md-raised md-primary" v-on:click='addProject()'>Add new project</md-button>
</div>
</template>

<script>
import blockchainUtils from '../util/blockchainUtils.js'

export default {
  name: 'registry',
  data () {
    return {
      msg: 'Welcome to Alice TC2',
      pseudo: undefined,
      projectName: '',
      pending: false
    }
  },
  mounted () {
    console.log('dispatching getContractInstance')
    this.$store.dispatch('getContractsInstances')
    this.$store.dispatch('syncWithContracts')
  },
  computed: {
    projects () {
      return this.$store.state.projects
    }
  },
  methods: {
    addProject () {
      this.pending = true
      console.log('Trying to add project with name: ' + this.projectName)
      let contractInstance = this.$store.state.getContractInstance('registry')
      contractInstance.applyWithProject(blockchainUtils.web3.fromAscii(this.projectName), {
        gas: 300000,
        from: this.$store.state.web3.coinbase
      }, (err, result) => {
        if (err) {
          console.log(err)
          this.pending = false
        } else {
          console.log('Event watching started')
          let ProjectAdded = contractInstance.ProjectAdded()
          ProjectAdded.watch((err, result) => {
            if (err) {
              console.log('Could not get event ProjectAdded()')
            } else {
              console.log('Project was added')
              this.$store.dispatch('syncWithContracts')
              this.pending = false
            }
          })
        }
      })
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .md-list {
    width: 100%;
    display: inline-block;
    vertical-align: top;
  }
  .md-list-item {
    border-bottom: 1px solid #D3D3D3;
  }
</style>
