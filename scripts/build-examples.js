'use strict';

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const RxWebpackPlugin = require('rx-webpack-plugin');

function getEntry() {

  let entry = {};

  function walk(dir) {
    dir = dir || '.'
    var directory = path.join(__dirname, '..', 'packages', 'weex-rx-examples', dir);
    fs.readdirSync(directory)
      .forEach(function(file) {
        var fullpath = path.join(directory, file);
        var stat = fs.statSync(fullpath);
        var extname = path.extname(fullpath);
        if (stat.isFile() && (extname === '.js' || extname === '.jsx')) {
          var name = path.join('packages', 'weex-rx-examples', 'build', dir, path.basename(file, extname));
          entry[name + '.bundle'] = fullpath;
        } else if (stat.isDirectory() && file !== 'build' && file !== 'common' && file !== 'node_modules') {
          var subdir = path.join(dir, file);
          walk(subdir);
        }
      });
  }

  walk();

  return entry;
}

const config = {
  target: 'node',
  entry: getEntry(),
  output: {
    path: '.',
    filename: '[name].js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new webpack.NoErrorsPlugin(),
    new RxWebpackPlugin({
      frameworkComment: true,
      externalBuiltinModules: true,
    }),
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
}

let compiler = webpack(config);
compiler.run(function(err, stats) {
 let options = {
   colors: true
 };
 console.log(stats.toString(options));
});
