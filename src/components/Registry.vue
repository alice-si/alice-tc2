<template>
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

    <md-list-item>
      <md-avatar>
        <img src="https://placeimg.com/40/40/people/5" alt="People">
      </md-avatar>

      <span class="md-list-item-text">Project 1</span>

      <md-button class="md-icon-button md-list-action">
        <md-icon class="md-primary">chat_bubble</md-icon>
      </md-button>
    </md-list-item>



  </md-list>
</template>

<script>
import Users from '@/js/users'

export default {
  name: 'registry',
  data () {
    return {
      msg: 'Welcome to Alice TC2',
      pseudo: undefined
    }
  },
  computed: {
    userExists: function () {
      return (typeof this.pseudo !== 'undefined')
    }
  },
  beforeCreate: function () {
    Users.init().then(() => {
      Users.exists(window.web3.eth.accounts[0]).then((exists) => {
        if (exists) {
          Users.authenticate().then(pseudo => {
            this.pseudo = pseudo
          })
        }
      })
    }).catch(err => {
      console.log(err)
    })
  },
  methods: {
    destroyAccount: function (e) {
      e.preventDefault()
      Users.destroy().then(() => {
        this.pseudo = undefined
      }).catch(err => {
        console.log(err)
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
