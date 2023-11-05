import path from 'node:path'
import { fileURLToPath } from 'node:url'

import os from 'node:os'
const threads = os.cpus().length

// import svgToMiniDataURI from 'mini-svg-data-uri'

// 生产构建映射json
import { WebpackManifestPlugin } from 'webpack-manifest-plugin'
// css压缩
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
// 将css link 引入
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
// eslint
import EslintPlugin from 'eslint-webpack-plugin'
// html
import HtmlWebpackPlugin from 'html-webpack-plugin'
// 压缩js多进程 当前版本好像没有
import TerserPlugin from 'terser-webpack-plugin'
// 图片压缩
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin'
// preload plugin 新的写法是import(/* webpackPreload: true */ 'ChartingLibrary');
// import PreloadWebpackPlugin from '@vue/preload-webpack-plugin'
// PWA 离线缓存
import WorkboxPlugin from 'workbox-webpack-plugin'
// VueLoaderPlugin
import { VueLoaderPlugin } from 'vue-loader'
import webpack from 'webpack'
// 文件copy
import CopyWebpackPlugin from 'copy-webpack-plugin'

// 自定义plugin
import TestPlutin from '../plugins/test-plugin.js'

// json5
import json5 from 'json5'

/**
module：就是js的模块化webpack支持commonJS、ES6等模块化规范，简单来说就是你通过import语句引入的代码。
chunk: chunk是webpack根据功能拆分出来的，包含三种情况：你的项目入口（entry）通过import()动态引入的代码  通过splitChunks拆分出来的代码
chunk包含着module，可能是一对多也可能是一对一。
每个文件都是bundel
bundle：bundle是webpack打包之后的各个文件，一般就是和chunk是一对一的关系，bundle就是对chunk进行编译压缩打包等处理之后的产出。
 */

// eslint-disable-next-line
const __filename = fileURLToPath(import.meta.url) // eslint-disable-line no-alert
const __dirname = path.dirname(__filename)

// file:///Users/wuzhenghui/demo/personage/webpack-app/webpack.config.js
// /Users/wuzhenghui/demo/personage/webpack-app/webpack.config.js
// /Users/wuzhenghui/demo/personage/webpack-app
// console.log(import.meta.url, __filename, __dirname)

function getStyleLoader(loader) {
  return [
    // 'style-loader', // 将style注入到页面 tyle-loader的作用是将css-loader生成的css代码挂载到页面的header部分
    MiniCssExtractPlugin.loader, // 生成link
    // 'vue-style-loader', // vue-style-loader
    // 处理@import 和 url css-loader的作用是帮我们分析出各个css文件之间的关系，把各个css文件合并成一段css
    'css-loader',
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: ['postcss-preset-env'],
        },
      },
    },
    loader,
  ].filter(Boolean)
}
// 使用几个进程打包默认2个
function useThreadNum(num = 3) {
  if (num > threads) {
    return threads
  }
  return threads - (threads - num)
}

export default (env) => {
  // console.log('development: ', env.development); // true
  // 生产模式html和js默认压缩
  let mode = 'production'
  if (env.development) {
    mode = 'development'
  }
  console.log(mode)
  return {
    entry: {
      main: './main.js',
    },
    output: {
      // filename: 'static/js/[name].bundle.js',
      filename: 'static/js/[name].[contenthash:10].js',
      // 代码分割的chunk name
      chunkFilename: 'static/js/[name].[contenthash:10].chunk.js',
      // 图片 字体 通过type:asset  的name
      assetModuleFilename: 'static/media/[name].[hash:10][ext][query]',
      path: path.resolve(__dirname, '../dist'),
      clean: true,
    },
    module: {
      rules: [
        // {
        // 文件仅使用其中一个配置
        // oneOf: [
        {
          // enforce: 'pre', 前置 loader
          test: /\.css$/i,
          use: [...getStyleLoader()],
        },
        {
          // enforce: 'post', 后置 loader
          test: /\.less$/i,
          use: [...getStyleLoader('less-loader')],
        },
        {
          test: /\.s[ac]ss$/i,
          use: [...getStyleLoader('sass-loader')],
        },
        {
          test: /\.styl$/i,
          use: [...getStyleLoader('stylus-loader')],
        },
        // js
        {
          test: /\.js$/,
          include: path.resolve(__dirname, '../src'),
          // exclude: /(node_modules|bower_components)/,
          use: [
            // 文件多开启多进程会有速度上的提升 否则会更慢
            /* {
                  loader: 'thread-loader', // 多进程
                  options: {
                    works: useThreadNum(), // 进程数量
                  }
                }, */
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true, // 开启bable缓存
                cacheCompression: false, // 关闭缓存文件压缩
                plugins: ['@babel/plugin-transform-runtime'],
              },
            },
          ],
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader',
        },
        // 图片
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          // type: 'asset/resource',
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 10 * 1024, // 4kb
            },
          },
          // generator: {
          //   filename: 'static/images/[name].[hash:10][ext][query]',
          // }
        },
        // 对字体资源直接输出不做任何处理
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          // 原封不动不动的输出
          type: 'asset/resource',
          /* generator: {
                filename: 'static/font/[hash:10][ext][query]',
              }, */
        },
        // 对媒体资源直接输出不做任何处理
        {
          test: /\.(map3|map4|avi|txt)$/i,
          // 原封不动不动的输出
          type: 'asset/resource',
          /* generator: {
                filename: 'static/media/[hash:10][ext][query]',
              }, */
        },
        {
          test: /\.json$/,
          type: 'json',
          /* parser: {
            parse: json5.parse,
          }, */
        },
        /**
         * 自定义 loader
         */
        {
          test: /\.json$/,
          type: 'asset',
          use: [
            {
              loader: './loaders/test-loader/index.js',
              options: {
                author: 'zhtestloader',
                parser: {
                  parse: json5.parse,
                },
              },
            },
          ],
        },
        // 自定义babel-loader
        /* {
          test: /\.js$/,
          include: path.resolve(
            __dirname,
            '../src/utils/customBabelLoaderTest.js',
          ),
          use: [
            {
              loader: './loaders/babel-loader',
              options: {
                presets: ['@babel/preset-env'],
              },
            },
          ],
        }, */
        // ]
        // },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, '../index.html'),
        title: 'webpack-app',
      }),
      new EslintPlugin({
        // 检查哪些文件
        context: path.resolve(__dirname, '../src'),
        exclude: 'node_modules',
        cache: true, // 开启缓存
        cacheLocation: path.resolve(
          __dirname,
          '../node_modules/.cache/eslintcache',
        ), // 缓存地址
        threads: useThreadNum(), // 开启多进程 2个
      }),
      new WebpackManifestPlugin({
        basePath: path.resolve(__dirname, '../dist'),
        fileName: 'rusult.json',
      }),
      new MiniCssExtractPlugin({
        filename: 'static/css/[name].css',
        chunkFilename: 'static/css/[name].chunk.css',
      }),
      new WorkboxPlugin.GenerateSW({
        clientsClaim: true,
        skipWaiting: true,
      }),
      new VueLoaderPlugin(),
      // 给源代码使用解决vue3警告 环境变量
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: true,
        __VUE_PROD_DEVTOOLS__: false,
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, '../public'),
            to: path.resolve(__dirname, '../dist'),
            // globOptions: {
            //   dot: true,
            //   gitignore: true,
            //   ignore: [''],
            // },
          },
        ],
      }),
      /* new PreloadWebpackPlugin({
        rel: 'prefetch',
        include: {
          type: 'asyncChunks',
          // entries: ['app']
        },
        // rel: 'preload',
        // as: 'script',
      }), */
      /**
       * 自定义 plugin
       */
      new TestPlutin(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '../src'),
      },
      extensions: ['.vue', '.js', '.json'],
    },
    // 当mode为production tree shaking 没有用到的方法不会被打包 可以进行配置 或者手动指定哪些模块没有副作用
    mode,
    // map文件生成方式
    // devtool: 'cheap-module-source-map',
    devtool: 'source-map',
    optimization: {
      // usedExports: true,
      // 关闭模块合并
      // concatenateModules: false,
      // 5 版本 压缩东西放这里
      minimizer: [
        // 当前版本没有 js开启多进程压缩
        new TerserPlugin({
          parallel: useThreadNum(),
          terserOptions: {},
        }),
        // css压缩
        mode === 'production' ? new CssMinimizerPlugin() : null,
        // 压缩图片
        new ImageMinimizerPlugin({
          minimizer: {
            implementation: ImageMinimizerPlugin.imageminGenerate,
            options: {
              plugins: [
                ['gifsicle', { interlaced: true }],
                ['jpegtran', { progressive: true }],
                ['gifsicle', { optimizationLevel: 5 }],
                [
                  'svgo',
                  {
                    plugins: [
                      'preset-default',
                      'prefixIds',
                      {
                        name: 'sortAttrs',
                        params: {
                          xmlnsOrder: 'alphabetical',
                        },
                      },
                    ],
                  },
                ],
              ],
            },
          },
        }),
      ],

      // main bundle 会随着自身的新增内容的修改，而发生变化。
      // vendor bundle 会随着自身的 module.id 的变化，而发生变化。
      // manifest runtime 会因为增加一个新模块的引用，而发生变化。
      // 上面的第一点与最后一点都是符合预期的行为，而 vendor 的哈希值发生变化是我们要修复的。
      // 试试将 optimization.moduleIds 设置为 'deterministic' （vendors的hash 不会改变）
      moduleIds: 'deterministic',
      runtimeChunk: 'single', // 将运行时代码提取到一个chunk
      // 将公共模块提取到一个新的chunk
      // 这样的第三方库很少像本地源代码一样频繁修改
      // 此通常推荐将第三方库提取到单独的 vendor chunk 中
      splitChunks: {
        chunks: 'all',
        // 将 node_modules 的包放进 单独vendor
        /* cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          vue: {
            minSize: 0,
            minChunks: 2,
            priority: 1,
            reuseExistingChunk: true,
          },
        } */
      },
    },
    // 性能
    performance: false,
    /* performance: {
      hints: 'warning',
      maxAssetSize: 250000,
      assetFilter: function (assetFilename) {
        return assetFilename.endsWith('.js');
      },
    }, */
  }
}
