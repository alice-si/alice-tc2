<template>
<div>
  <input type="text" v-model='projectName'>
  <input type="button" value="Add new project" v-on:click='addProject()'>

  <md-list>
    <md-list-item>
      <md-avatar>
        <img src="https://placeimg.com/40/40/people/5" alt="People">
      </md-avatar>

      <span class="md-list-item-text">Project 1</span>

      <md-button class="md-icon-button md-list-action">
        <md-icon class="md-primary">chat_bubble</md-icon>
      </md-button>
    </md-list-item>

    <md-list-item v-for='project in projects'>
      <md-avatar>
        <img src="https://placeimg.com/40/40/people/5" alt="People">
      </md-avatar>

      <span class="md-list-item-text">{{ project }}</span>

      <md-button class="md-icon-button md-list-action">
        <md-icon class="md-primary">chat_bubble</md-icon>
      </md-button>
    </md-list-item>
  </md-list>
</div>
</template>

<script>

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
    this.$store.dispatch('getContractInstance')
    this.$store.dispatch('updateProjects')
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
      this.$store.state.contractInstance().addProject(this.projectName, {
        gas: 300000,
        from: this.$store.state.web3.coinbase
      }, (err, result) => {
        if (err) {
          console.log(err)
          this.pending = false
        } else {
          console.log('Event watching started')
          let ProjectAdded = this.$store.state.contractInstance().ProjectAdded()
          ProjectAdded.watch((err, result) => {
            if (err) {
              console.log('Could not get event ProjectAdded()')
            } else {
              console.log('Project was added')
              this.$store.dispatch('updateProjects')
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
