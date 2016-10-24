'use strict';

const path = require('path');
const webpack = require('webpack');

var config = {
  devtool: 'source-map',
  entry: {
    rx: ['./packages/universal-rx/src/index.js'],
  },
  output: {
    path: './packages/universal-rx/build/',
    filename: '[name].js',
    sourceMapFilename: '[file].map',
    library: 'Rx',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
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
