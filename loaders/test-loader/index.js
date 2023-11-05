// import schema from './schema.json'
// console.log(schema)

// normal loader
function testLoader(content, map, meta) {
  // schema 为 options 验证规则
  const options = this.getOptions()
  const prefix = `/* Author: ${options.author} */`
  const callback = this.async()
  // 输出文件
  // this.emitFile(文件名, 内容)

  // setTimeout(() => {
  //   callback(null, prefix + content, map, meta)
  // }, 1000)

  /* Promise.resolve(11).then(() => {
    callback(null, content, map, meta)
  }) */
  // return;
  console.log('type:', typeof content)
  console.log('content:', content)
  console.log('options:', options)
  console.log('prefix:', prefix)
  console.log(options.parser.parse(content.replace('bb', 'cc')))

  callback(null, /* prefix + */ content.replace('bb', 'cc'), map, meta)
  // callback(null, options.parser.parse(content.replace('bb', 'cc')), map, meta)
}
// 接收到的content 会转换为 buffer（二进制）
const raw = true
// 优先执行 如果每个 loader 都有 pitch 则按rules: [ { use: ['loader1', 'loader2'] } ] 里的顺序 loader1 -> loader2
// 随后 normal loader 依次 loader2 -> loader1

// content 是后面未执行的loader 如loader1 pitch 参数contetn 是 loader2 未执行的loader
const pitch = function (content, map, meta) {
  console.log('pitch', content)
  // return 都 后面的 pitch loader 会中断 直接执行normal loader
  // this.callback(null, content, map, meta)
}
export // raw,
// pitch,
 {}

export default testLoader
