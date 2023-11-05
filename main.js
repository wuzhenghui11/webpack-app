// 全部引入 或者按需引入 通过babel
// import 'core-js'
// import { print, component } from /* webpackPreload: true */'@/utils/common.js'
// import { sum } from '@/utils/math.js'
// import { isArray } from 'zhzl'

import { createApp, defineComponent } from 'vue'
import App from './App.vue'
import router from '@/router/index.js'

// 自定loader 处理json 测试
const testloader = import(
  /* webpackChunkName: 'testloaderJSON' */ '@/assets/testLoader.json'
)
testloader.then((result) => {
  console.log(result.default.split(',')[1])
  console.log(JSON.parse(window.atob(`${result.default.split(',')[1]}`)))
})
// 自定loader 处理js 测试
const babelLoader = import(
  /* webpackChunkName: 'babelLoaderTest' */ '@/utils/customBabelLoaderTest.js'
)
babelLoader.then((result) => {
  result.default()
})

const common = import(
  /* webpackPreload: true */
  /* webpackChunkName: 'common' */
  '@/utils/common.js'
)
const zhzl = import(
  /* webpackPreload: true */
  /* webpackChunkName: 'zhzl' */
  'zhzl'
)

common.then(({ component, print }) => {
  document.body.appendChild(component())
  print()
})

Promise.resolve(11).then((r) => {
  console.log(r)
  console.log([1, 2].includes(1))
})

zhzl.then((d) => {
  console.log(d.isArray(''))
})

// pwa 有兼容性技术
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/service-worker.js').then(registration => {
//       console.log('SW registered: ', registration)
//     }).catch(registrationError => {
//       console.log('SW registration failed: ', registrationError)
//     })
//   })
// }

/* if (module.hot) {
  // 如果commonjs 变更则只更新 commonjs
  // vue-loader和react-loader自动带这个功能
  // accept('./src/utils/common.js', function () {})
  module.hot.accept('./src/utils/common.js')
} */

const app = createApp(App)
app.use(router)
app.mount('#app')
