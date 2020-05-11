const path = require('path');
const webpack = require('webpack');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const publicPath = ''
module.exports = {
  mode: 'production',
  entry: './demo/index.js',
  output: {
    publicPath: publicPath,
    path: path.resolve(__dirname, 'dist' ),
    filename: 'js/[name].[hash].js',
  },
  devtool: false,
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
          ],
          plugins: ['transform-remove-console']
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
    }),
    new HtmlWebpackPlugin({
      title: 'demo',
      template: path.join(__dirname, '', 'demo/index.html')
    })
  ]
}