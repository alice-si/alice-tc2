import Vue from 'vue'
import Router from 'vue-router'
import Registry from '@/components/Registry'
import Signup from '@/components/Signup'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

Vue.use(VueMaterial)
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'registry',
      component: Registry
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup
    }
  ]
})
