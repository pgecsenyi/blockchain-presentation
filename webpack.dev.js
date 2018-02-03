const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

const common = require('./webpack.common');

module.exports = merge(common, {
  module: {
    loaders: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      }
    ]
  },

  devtool: 'source-map',

  // `watch: true` can be used instead of `devServer`
  devServer: { inline: true }
});
