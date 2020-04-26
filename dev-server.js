const path = require('path')
const webpackServer = require('webpack-dev-server')
const webpack = require('webpack')
const devConfig = require('./webpack.dev')
const portfinder = require('portfinder')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const port = 5000
const host = 'localhost'
const options = {
  contentBase: './example',
  hot: true,
  compress: true,
  host: host,
  quiet: true,
  open: true
}
portfinder.basePort = port
portfinder.getPort((err, port) => {
  if (err) {
    console.log(err)
  } else {
    process.env.PORT = port
    devConfig.plugins.push(new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: [`可以打开浏览器浏览一下网址: http://${host}:${port}`]
      }
    }))
    const compiler = webpack(devConfig)
    const server = new webpackServer(compiler, options)
    server.listen(port)
  }
})