import Vue from 'vue'
import VueRouter from '../vueRouter'
import Home from '@/views/home'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: 'About' */ '@/views/about')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
