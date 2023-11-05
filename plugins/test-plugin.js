/**
 * 1. 加载 webpackconfig 就会 new TestPlugin 执行插件的 constructor 方法
 * 2. 创建 compiler 对象 只会创建一个
 * 3. 遍历所有 plugin 执行 apply 方法
 * 4. 执行剩下的编译流程
 * */
class TestPlugin {
  constructor() {
    console.log(11)
  }
  apply(compiler) {
    console.log(22)
    // environment
    compiler.hooks.afterEnvironment.tap('TestPlugin', () => {
      console.log('333')
    })
    compiler.hooks.emit.tap('TestPlugin', (compilation) => {
      console.log('44', compilation)
    })
    // 异步串行 类似同步 顺序确定

    // 异步并行 同时触发 顺序不确定
  }
}

export default TestPlugin
