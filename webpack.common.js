const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

var sourceDirectory = path.join(__dirname, 'src');
var distDirectory = path.join(__dirname, 'dist');

module.exports = {
  entry: path.join(sourceDirectory, 'js/bootstrap.js'),
  output: {
    path: distDirectory,
    filename: 'slideshow.js'
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        // use: [ 'style-loader', 'css-loader' ]
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [ 'css-loader' ]
        })
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
    new ExtractTextPlugin({
      filename: 'style.css',
      allChunks: true
    }),
    new webpack.ProvidePlugin({
      Chart: 'chart.js'
    })
  ]
};
