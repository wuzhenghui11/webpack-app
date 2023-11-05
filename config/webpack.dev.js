import path from 'node:path'
import { fileURLToPath } from 'node:url'

import EslintPlugin from 'eslint-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { VueLoaderPlugin } from 'vue-loader'
import webpack from 'webpack'

// json5
import json5 from 'json5'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function getStyleLoader(loader) {
  return [
    // 'style-loader', // 将style注入到页面
    // MiniCssExtractPlugin.loader, // 生成link
    'vue-style-loader', // vue-style-loader
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

export default (env) => {
  return {
    entry: {
      main: './main.js',
    },
    output: {
      filename: 'static/js/[name].js',
      // 代码分割的chunk name
      chunkFilename: 'static/js/[name].chunk.js',
      // 图片 字体 通过type:asset  的name
      assetModuleFilename: 'static/media/[name][ext][query]',
      path: undefined,
    },
    module: {
      rules: [
        // {
        // 文件仅使用其中一个配置
        // oneOf: [
        {
          test: /\.css$/i,
          use: getStyleLoader(),
        },
        {
          test: /\.less$/i,
          use: getStyleLoader('less-loader'),
        },
        {
          test: /\.s[ac]ss$/i,
          use: getStyleLoader('sass-loader'),
        },
        {
          test: /\.styl$/i,
          use: getStyleLoader('stylus-loader'),
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader',
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          include: path.resolve(__dirname, '../src'),
          options: {
            cacheDirectory: true, // 开启bable缓存
            cacheCompression: false, // 关闭缓存文件压缩
            plugins: ['@babel/plugin-transform-runtime'],
          },
        },
        // 图片
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          // type: 'asset/resource',
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 10 * 1024, // 10kb
            },
          },
        },
        // 对字体资源直接输出不做任何处理
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          // 原封不动不动的输出
          type: 'asset/resource',
        },
        // 对媒体资源直接输出不做任何处理
        {
          test: /\.(map3|map4|avi|txt)$/i,
          // 原封不动不动的输出
          type: 'asset/resource',
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
        // ]
        // }
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, '../index.html'),
        // favicon: path.resolve(__dirname, '../public/favicon.png'),
        title: 'webpack-app-vue',
      }),
      new EslintPlugin({
        // 检查哪些文件
        context: path.resolve(__dirname, '../src'),
        exclude: 'node_modules',
        cache: true, // 开启缓存
        cacheLocation: path.resolve(
          __dirname,
          '../node_modules/.cache/.eslintcache',
        ), // 缓存地址
      }),
      new VueLoaderPlugin(),
      /* new MiniCssExtractPlugin({
        filename: 'static/css/base.css'
        filename: 'static/css/[name].[hash:10].css'
      }), */
      // 给源代码使用解决vue3警告
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: true,
        __VUE_PROD_DEVTOOLS__: false,
      }),
    ],
    mode: 'development',
    devtool: 'cheap-module-source-map',
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
      runtimeChunk: 'single', // 将运行时代码提取到一个chunk
      moduleIds: 'deterministic',
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '../src'),
      },
      extensions: ['.vue', '.js', '.json'],
    },
    devServer: {
      port: 8090,
      // open: true,
      hot: true,
      historyApiFallback: true,
    },
    // 性能
    performance: false,
  }
}
