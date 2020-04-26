const path = require('path');
const webpack = require('webpack');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: ['./src/index.js', './src/nav.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'ybnav.js', // 打包之后生成的文件名，可以随意写。
    globalObject: 'this', // 定义全局变量,兼容node和浏览器运行，避免出现"window is not defined"的情况
    library: 'YBnav',
    libraryTarget: 'umd' // 定义打包方式Universal Module Definition,同时支持在CommonJS、AMD和全局变量使用
  },
  devtool: false,
  module: {
    rules: [{
      test: /\.(sass|scss|css)$/,
      use: [{
        loader: MiniCssExtractPlugin.loader,
        options: {
          hmr: true
        }
      }, {
        loader: 'css-loader',
        options: {
          sourceMap: true,
          importLoaders: 2
        }
      }, {
        loader: 'postcss-loader',
        options: {
          sourceMap: true
        }
      }, {
        loader: 'sass-loader',
        options: {
          sourceMap: true
        }
      }]
    }]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.ProgressPlugin(),
    new MiniCssExtractPlugin({
      filename: 'ybnav.css'
    }),
    new webpack.DefinePlugin({
      'process.env.BASE_URL': '\"' + process.env.BASE_URL + '\"'
    }),
    //压缩css
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    })
  ]
}