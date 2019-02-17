<template>
<div>

  <md-list>

    <md-list-item v-for='project in activeProjects'>
      <span class="md-list-item-text">{{ project.name}}</span>
      <span class="md-list-item-text">{{project.status}}</span>

      <md-button class="md-raised" v-on:click='challenge(project)'>Challenge</md-button>
    </md-list-item>
  </md-list>

  <md-list>
    <span class="md-title">Waiting list</span>
    <md-list-item v-for='project in applications'>

      <span class="md-list-item-text">{{ project.name }}</span>

      <span v-if="project.canVote">
        <md-button v-on:click="vote(true, project)" class="md-icon-button md-list-action yes-button" >
          <md-icon class="md-primary">check</md-icon>
        </md-button>
      </span>

      <md-progress-bar class="voting" md-mode="determinate" :md-value="project.ratio"></md-progress-bar>


      <span v-if="project.canVote">
        <md-button v-on:click="vote(false, project)" class="md-icon-button md-list-action no-button">
          <md-icon class="md-primary">close</md-icon>
        </md-button>
      </span>


      <!--
      <span v-if="project.yesTotal >= 0 || project.noTotal >= 0">
        <table>
          <tr>
            <td>Yes</td>
            <td>{{project.yesTotal}}</td>
          </tr>
          <tr>
            <td>No</td>
            <td>{{project.noTotal}}</td>
          </tr>
        </table>
      </span>
      -->





    </md-list-item>
  </md-list>

  <md-field>
      <label>Project name</label>
      <md-input v-model="projectName"></md-input>
  </md-field>
  <md-button class="md-raised md-primary" v-on:click='applyWithProject()'>Apply with a new project</md-button>
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
    },
    activeProjects () {
      return this.$store.state.projects.filter(project =>
        project.status !== 'APPLICATION'
      )
    },
    applications () {
      return this.$store.state.projects.filter(project =>
        project.status === 'APPLICATION'
      )
    }
  },
  methods: {
    applyWithProject () {
      this.pending = true
      console.log('Trying to add project with name: ' + this.projectName)
      let contractInstance = this.$store.state.getContractInstance('wallet')
      contractInstance.applyAndPay(blockchainUtils.web3.fromAscii(this.projectName), {
        from: this.$store.state.web3.coinbase, gas: 3000000
      }, (err, result) => {
        this.projectName = ''
        if (err) {
          console.log(err)
          this.pending = false
        } else {
          console.log('Event watching started')
          let ProjectAdded = this.$store.state.getContractInstance('registry').ProjectAdded()
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
    },
    vote (yesOrNo, project) {
      console.log('Voting for project nr: ' + project.id + ' | Vote: ' + yesOrNo)
      console.log(project)
      let contractInstance = this.$store.state.getContractInstance('registry')
      const balance = this.$store.state.tokenBalance
      contractInstance.vote(project.id, balance, yesOrNo, {
        from: this.$store.state.web3.coinbase
      }, (err, result) => {
        if (err) {
          console.log(err)
        }
      })
    },
    challenge (project) {
      console.log('Challenging project nr: ' + project.id)
      console.log(project)
      let contractInstance = this.$store.state.getContractInstance('wallet')
      contractInstance.challengeAndPay(project.id, {
        from: this.$store.state.web3.coinbase
      }, (err, result) => {
        if (err) {
          console.log(err)
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
  .voting {
    width: 200px;
  }
  .yes-button {
    margin-right: 0 !important;
  }
  .no-button {
    margin-left: 0 !important;
  }
</style>
