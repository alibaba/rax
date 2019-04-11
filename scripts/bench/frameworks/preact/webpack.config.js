'use strict';

const path = require('path');
const webpack = require('webpack');

const loaders = [
  {
    test: /\.jsx$/,
    loader: 'babel-loader'
  },
  {
    test: /\.es6\.js$/,
    loader: 'babel-loader'
  }
];
const extensions = [
  '.js', '.jsx', '.es6.js', '.msx'
];

module.exports = [{
  mode: 'production',
  module: {
    rules: loaders
  },
  entry: {
    main: './src/Main.jsx',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    sourceMapFilename: '[file].map',
  },
  resolve: {
    extensions: extensions,
    modules: [
      __dirname,
      path.resolve(__dirname, 'src'),
      'node_modules'
    ],
    alias: {
      'preact': 'node_modules/preact/dist/preact.min.js',
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ]
}];