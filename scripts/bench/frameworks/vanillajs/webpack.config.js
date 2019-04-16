'use strict';
const path = require('path');
const webpack = require('webpack');

const rules = [
  {
    test: /\.js$/,
    loader: 'babel-loader'
  }
];
const extensions = [
  '.js', '.jsx', '.es6.js'
];

module.exports = [{
  mode: 'production',
  module: {
    rules: rules
  },
  entry: {
    main: './src/Main.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  resolve: {
    extensions: extensions,
    modules: [
      __dirname,
      path.resolve(__dirname, 'src'),
      'node_modules'
    ],
    alias: {
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify('production') }
    })
  ],
}];