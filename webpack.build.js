const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'ybnav.js', // 打包之后生成的文件名，可以随意写。
    globalObject: 'this', // 定义全局变量,兼容node和浏览器运行，避免出现"window is not defined"的情况
    library: 'YBnav',
    libraryTarget: 'umd' // 定义打包方式Universal Module Definition,同时支持在CommonJS、AMD和全局变量使用
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: [{
        loader: MiniCssExtractPlugin.loader,
      }, {
        loader: 'css-loader'
      }]
    }]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new MiniCssExtractPlugin({
      filename: "ybnav.css",
      chunkFilename: "[id].css"
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano')
    })
  ]
}