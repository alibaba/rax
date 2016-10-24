'use strict';

const path = require('path');
const webpack = require('webpack');
const RxWebpackPlugin = require('rx-webpack-plugin');

var config = {
  devtool: 'source-map',
  entry: {
    'rx': './packages/universal-rx/src/index.js',
    'rx.min': './packages/universal-rx/src/index.js',
  },
  output: {
    path: './packages/universal-rx/dist/',
    filename: '[name].js',
    sourceMapFilename: '[name].map',
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new RxWebpackPlugin({
      moduleName: 'rx',
      globalName: 'Rx',
    }),
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      minimize: true,
      compress: {
        warnings: false
      }
    })
  ],
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel', // 'babel-loader' is also a legal name to reference
      query: {
        presets: ['es2015', 'rx'],
      }
    }]
  }
};

var compiler = webpack(config);
compiler.run(function(err, stats) {
 var options = {
   colors: true
 };
 console.log(stats.toString(options));
});
