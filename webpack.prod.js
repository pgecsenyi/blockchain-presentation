const webpack = require('webpack');
const merge = require('webpack-merge');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const common = require('./webpack.common');

module.exports = merge(common, {
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new OptimizeCssAssetsPlugin(),
    new UglifyJSPlugin()
  ]
});
