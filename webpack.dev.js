const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: './demo/index.js',
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, '', '/example'),
    publicPath: '/',
    filename: 'js/[name].js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'demo',
      template: path.join(__dirname, '', 'demo/index.html')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.BASE_URL': '\"' + process.env.BASE_URL + '\"'
    }),
    new webpack.ProgressPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    })
  ],
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules)/,
      use:[{
        loader: 'babel-loader',
        options: {
          presets: [
            ["@babel/preset-env", {
              useBuiltIns: 'entry'
            }]
          ]
        }
      }]
    }, {
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
  }
}