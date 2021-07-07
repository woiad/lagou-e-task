const common = require('./webpack.common')
const { merge } = require('webpack-merge')
const path = require('path')

module.exports = merge(common, {
  devServer: {
    contentBase: path.resolve('dist'),
    compress: true,
    port: 9000,
    hot: true,
    open: true
  },
})
