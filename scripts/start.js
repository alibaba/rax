'use strict';

const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const RxWebpackPlugin = require('rx-webpack-plugin');
const fs = require('fs');
const EXAMPLES_DIR = path.resolve(__dirname, '../examples');

function getEntry() {
  let entry = {};

  fs.readdirSync(EXAMPLES_DIR)
    .map(file => {
      let f = path.resolve(EXAMPLES_DIR, file);
      if (fs.lstatSync(path.resolve(f)).isDirectory()) {
        entry[file + '.bundle'] = f;
      }
    });

  return entry;
}

var config = {
  target: 'node',
  devtool: '#inline-source-map',
  entry: getEntry(),
  output: {
    path: __dirname,
    filename: '[name].js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new webpack.NoErrorsPlugin(),
    new RxWebpackPlugin({
      frameworkComment: true
    }),
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
var server = new WebpackDevServer(compiler, {
  publicPath: config.output.publicPath,
  stats: {
    colors: true
  },
});
server.listen(9999);
