const path = require('path')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const baseConfig = require('./base.config')
const checkPort = require('./utils/check-port')

const devConfig = merge.smart(baseConfig, {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    host: '0.0.0.0',
    useLocalIp: true,
    port: 8000,
    open: true
  },
  plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })]
})

module.exports = checkPort(devConfig)
