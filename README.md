## 一、webpack 总结

**提示！**

> preload-webpack-plugin 不再维护 使用@vue/preload-webpack-plugin

[https://www.bilibili.com/video/BV14T4y1z7sw?p=41&spm_id_from=pageDriver&vd_source=44db4bf2ddc1a3a4d2b8f624aad37b11]

### 1. 提升开发体验

- source Map 上线时代码报错有准确提示

### 2. 提升webpack打包速度

- HotModuleReplacement 模块热替换，只更新有变动的代码，无变动的缓存
- OneOf 让文件只用某一个loader处理，不再继续遍历
- Includes/Excludes 只处理某些文件，处理文件减少，速度变快
- Cache 对eslint和babel处理结果进行缓存，二次打包速度更快
- Thead 多进程处理eslint 和 bable 任务 （代码较多的时候开启）

### 3. 减少代码体积

- Tree Shaking 剔除没有使用到的代码，代码体积更小
- @babel/plugin-transform-runtime 对 babel 进行处理，让辅助代码从中引入，而不是每个文件都生成辅助代码，体积更小
- Image Minimizer 对图片进行优化处理，无损和有损，体积更小（在线链接就不需要）

### 4. 优化代码运行性能

- code split 对代码进行分割成多个js文件，动态引入，按需加载
- preload/prefetch 对代码预加载 未来需要时就直接使用
- newwork cache 对输出资源进行更好的命名，将来做好缓存体验更好
- core-js js兼容性处理 让我们代码低版本浏览器也能运行
- PWA 离线缓存，离线也能访问，提升用户体验，一般用于文档 静态类型网站

### 5. 图片压缩

```bash
#图片压缩
pnpm i -D image-minimizer-webpack-plugin imagemin
#无损压缩
pnpm i -D imagemin-gifsicle imagemin-jpegtran imagemin-optipng imagemin-svgo
#有损压缩
pnpm i -D imagemin-gifsicle imagemin-mozjpeg imagemin-pngquant imagemin-svgo
```

packagejson中 "sideEffects": false, webpack 如果我们引入的 包/模块 被标记为 sideEffects: false 了，那么不管它是否真的有副作用，只要它没有被引用到，整个 模块/包 都会被完整的移除

****

## 三、ESLint

**核心**

- 规则
- 配置文件
- 可共享的配置
- 插件
- 解析器
- 自动移处理器
- 格式化器
- 集成
- CLI和Node.js

从 ESLint v9.0.0 开始，扁平配置文件格式将成为默认配置文件格式。 ESLint v9.0.0 发布后，你可以开始使用扁平配置文件格式，无需任何额外配置。
要在 ESLint v8 中使用扁平配置，请将 eslint.config.js 文件放置在项目的根目录中 或者 将 ESLINT_USE_FLAT_CONFIG 环境变量设置为 true。

- 解析器 parser 解析为抽象语法树（AST）
- 处理器 processors
- 格式化器 对文件进行格式化

****

## 四、Babel

Babel 是一个工具链，主要用于将采用 ECMAScript 2015+ 语法编写的代码转换为向后兼容的 JavaScript 语法，以便能够运行在当前和旧版本的浏览器或其他环境中。下面列出的是 Babel 能为你做的事情：

- 语法转换
- 通过 Polyfill 方式在目标环境中添加缺失的功能（通过引入第三方 polyfill 模块，例如 core-js）
- 源码转换（codemods）

@babel/parser 将js处理为AST
@babel/traverse 这个库主要是遍历AST，操作Node上的节点。暴露了traverse(ast, opts)这个API 对语法树中特定的节点进行操作(特殊节点的函数)

```js
traverse(ast, {
  CallExpression(p) {
    // 对语法树中特定的节点进行操作 参考@babel/types （特定节点类型）
    // CallExpression 特定节点
  },
  FunctionDeclaration: function(path) {
    // 对语法树中特定的节点进行操作 参考@babel/types （特定节点类型）
    // FunctionDeclaration 特定节点
  }
  // .....

  enter(path) {
    // 进入节点
    if (path.node.type === "ThisExpression") {
      // 对所有的操作
    };
  }
  exit(path) {
    // 退出节点
    console.log(`  exit ${path.type}(${path.key})`)
  }
})
```

@babel/generator 将 AST 转化成正常的代码 code

@babel/core 将 code 

```javascript
// code 代码 options怎样的处理 func 返回处理的结果
babel.transform(code, options, function(err, result) {
  result; // => { code, map, ast }
});
```
