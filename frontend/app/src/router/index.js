import Vue from 'vue'
import Router from 'vue-router'
import auth from '../components/login-signup'
import wall from '../view/wall'
import profile from '../view/profile'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'auth',
      component: auth
    },
    {
      path: '/wall',
      name: 'wall',
      component: wall
    },
    {
      path: '/profile/:id',
      name: 'profile',
      component: profile
    }
  ]
})