const withTypescript = require('@zeit/next-typescript')
const webpack = require('webpack')
module.exports = withTypescript({
  webpack(config) {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.API_URL': JSON.stringify(process.env.API_URL),
        'process.env.SOCKET_URL': JSON.stringify(process.env.SOCKET_URL)
      })
    )
    return config
  },
  publicRuntimeConfig: {
    localeSubpaths: process.env.LOCALE_SUBPATHS === 'true'
  }
})
