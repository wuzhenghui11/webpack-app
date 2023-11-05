<script setup>
import { onMounted } from 'vue'
import { RouterView, RouterLink } from 'vue-router'

onMounted(() => {
  document.querySelector('#btn').addEventListener('click', () => {
    import(
    /* webpackPreload: true */
    /* webpackChunkName: 'math' */
    '@/utils/math.js').then((d) => {
      console.log(d.sum(1, 2))
    })
  })
})
</script>

<template>
  <button type="button" id="btn">btn</button>
  <span class="iconfont icon-xiaoxi-zhihui"></span>
  <span class="iconfont icon-shangchuantupian"></span>
  <span class="iconfont icon-edit"></span>
  <span class="iconfont icon-search_light"></span>
  <p><router-link to="/">Go to Home</router-link></p>
  <p><router-link to="/about">Go to About</router-link></p>
  <router-view></router-view>
</template>

<style scoped>
</style>
