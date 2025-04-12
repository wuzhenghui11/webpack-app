import { createRouter, createWebHashHistory } from 'vue-router'

const Home = () => import(/* webpackChunkName: 'Home' */'@/views/Home.vue') 
const About = () => import(/* webpackChunkName: 'About' */'@/views/About.vue')


export default createRouter({
  history: createWebHashHistory(window.__POWERED_BY_QIANKUN__ ? '#/webpack-app-vue-micro' : '#/webpack-app-vue-micro'),
  routes: [
    {
      path: '/',
      name: Home,
      component: Home,
      // children: [
        
      // ]
    },
    {
      path: '/about',
      name: About,
      component: About
    }
  ]
})
