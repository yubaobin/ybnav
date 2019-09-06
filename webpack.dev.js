const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: './demo/index.js',
  devtool: 'cheap-module-eval-source-map',
  output: {
    path: path.join(__dirname, '', '/example'),
    publicPath: '/',
    filename: 'js/[name].[hash].js',
  },
  plugins: [
    new CleanWebpackPlugin(['example']),
    new HtmlWebpackPlugin({
      title: 'demo2',
      template: path.join(__dirname, '', 'demo/index.html')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new UglifyJSPlugin({
      sourceMap: true
    })
  ],
  module: {
    rules: [{
      test: /\.css$/,
      use: [{
        loader: 'style-loader',
      }, {
        loader: 'css-loader'
      }]
    }, {
      test: /\.(png|svg|jpg|gif)$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 4096,
          fallback: {
            loader: 'file-loader',
            options: {
              name: 'img/[name].[hash:8].[ext]'
            }
          }
        }
      }],
      exclude: [path.resolve(__dirname, 'src/font')]
    }, {
      test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
      include: [path.resolve(__dirname, 'src/font')],
      use: [{
        loader: 'file-loader',
        options: {
          limit: 4096,
          name: 'fonts/[name].[hash:8].[ext]'
        }
      }]
    }]
  }
}