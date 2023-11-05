import { join, forEach } from 'lodash-es'

import(/* webpackChunkName: 'base' */'@/assets/base.css')
// import '@/assets/less/common.less'
// import '@/assets/scss/common.scss'
// import '@/assets/stylus/common.styl'
import Meinv from '@/assets/images/meinv.jpeg'
import Icon from '@/assets/images/arrow_02.png'

export function component() {
  const element = document.createElement('div')

  // lodash 现在使用 import 引入。
  element.innerHTML = join(['Hello', 'webpack'], ' ')
  element.classList.add('hello')

  // 将图像添加到已经存在的 div 中。
  const myIcon = new Image()
  myIcon.src = Icon
  element.appendChild(myIcon)

  const mvImage = new Image()
  mvImage.src = Meinv
  mvImage.style.cssText = 'width: 100px; height:100px; transform: scale(.5)'
  element.appendChild(mvImage)

  return element
}

export function print () {
  const aa = 11
  const str = `公共${aa}}`
  const arr = [1, 2, 3, 4]
  console.log(str, ...arr)
}

export function addCookie (name, value) {
  document.cookie = `${name}=${value}`
  forEach([1, 2, 3], (item) => {
    console.log(item)
  })
}

export function getCookie (name) {
  document.cookie.getCookie(name)
}
