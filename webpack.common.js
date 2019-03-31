const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');
const webpack = require('webpack');

const sourceDirectory = path.join(__dirname, 'src');
const distDirectory = path.join(__dirname, 'dist');

module.exports = {
  entry: path.join(sourceDirectory, 'js/bootstrap.js'),
  output: {
    path: distDirectory,
    filename: 'slideshow.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [ MiniCssExtractPlugin.loader, 'css-loader' ]
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/i,
        loader: 'file-loader?name=font/[name].[ext]'
      },
      {
        test: /\.(gif|jpe?g|png|svg)$/i,
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      { context: sourceDirectory, from: 'image/**/*' },
      { context: sourceDirectory, from: 'index.html' }
    ]),
    new MiniCssExtractPlugin({
      chunkFilename: "[id].css",
      filename: "style.css"
    }),
    new webpack.ProvidePlugin({
      Chart: 'chart.js'
    })
  ]
};
