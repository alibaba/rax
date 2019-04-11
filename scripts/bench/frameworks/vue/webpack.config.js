'use strict';
const path = require('path');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const cache = {};
const loaders = [
  {
    test: /\.js$/,
    loader: 'babel-loader',
    exclude: /node_modules/
  },
  {
    test: /\.css$/,
    use: [
      'vue-style-loader',
      'css-loader'
    ]
  },
  {
    test: /\.vue$/,
    loader: 'vue-loader',
    query: {
      preserveWhitespace: false
    }
  }
];
const extensions = [
  '.js', '.jsx', '.es6.js', '.msx'
];

module.exports = [{
  mode: 'production',
  cache: cache,
  module: {
    rules: loaders
  },
  entry: {
    main: './src/main',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    sourceMapFilename: '[file].map',
  },
  resolve: {
    modules: [
      __dirname,
      path.resolve(__dirname, 'src'),
      'node_modules'
    ],
    extensions: extensions
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ]
}];
