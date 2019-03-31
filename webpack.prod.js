const merge = require('webpack-merge');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserJsPlugin = require("terser-webpack-plugin");
const webpack = require('webpack');

const common = require('./webpack.common');

module.exports = merge(common, {
  mode: "production",
  optimization: {
    minimizer: [
      new TerserJsPlugin(),
      new OptimizeCssAssetsPlugin()
    ]
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin()
  ]
});
