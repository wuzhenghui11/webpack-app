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

// 如果不在qiankun中
if (!window.__POWERED_BY_QIANKUN__) {
  app.mount('#app')
}

// 微应用
/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap () {
  console.log('react app bootstraped')
}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount (props) {
  console.log(props)
  app.mount(props.container ? props.container.querySelector('#app') : '#app')
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount (props) {
  app.unmount()
}

/**
 * 可选生命周期钩子，仅使用 loadMicroApp 方式加载微应用时生效
 */
export async function update (props) {
  console.log('update props', props)
}