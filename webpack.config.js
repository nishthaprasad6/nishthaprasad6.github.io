const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    index: path.join(__dirname, 'src/index')
  },
  output: {
    path: path.join(__dirname, 'public/js'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.ts']
  },
  resolveLoader: {
    modules: [path.join(__dirname, 'node_modules')]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader'
        }
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader'
            },
            {
              loader: 'postcss-loader'
            },
            {
              loader: 'sass-loader',
              options: {
                outputStyle: 'compressed'
              }
            }
          ]
        })
      }
    ]
  },
  plugins: [new ExtractTextPlugin('../css/[name].css')]
};
