import Vue from 'vue'
import Router from 'vue-router'
import Registry from '@/components/Registry'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'registry',
      component: Registry
    }
  ]
})
