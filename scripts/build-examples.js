/**
 * build weex-rax-examples
 */
'use strict';

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const RaxWebpackPlugin = require('rax-webpack-plugin');

function getEntry() {
  let entry = {};

  function walkExamples(dir) {
    dir = dir || '.';
    var directory = path.join(__dirname, '..', 'packages', 'weex-rax-examples', dir);
    fs.readdirSync(directory)
      .forEach(function(file) {
        var fullpath = path.join(directory, file);
        var stat = fs.statSync(fullpath);
        var extname = path.extname(fullpath);
        if (stat.isFile() && (extname === '.js' || extname === '.jsx')) {
          var name = path.join('packages', 'weex-rax-examples', 'build', dir, path.basename(file, extname));
          entry[name + '.bundle'] = fullpath;
        } else if (stat.isDirectory() && file !== 'build' && file !== 'common' && file !== 'node_modules') {
          var subdir = path.join(dir, file);
          walkExamples(subdir);
        }
      });
  }

  walkExamples();

  return entry;
}

const config = {
  target: 'node',
  entry: getEntry(),
  output: {
    path: path.join(__dirname, '..'),
    filename: '[name].js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new RaxWebpackPlugin({
      frameworkComment: true,
      externalBuiltinModules: true,
    }),
  ],
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader', // 'babel-loader' is also a legal name to reference
      query: {
        presets: ['es2015', 'rax'],
      }
    }]
  }
};

let compiler = webpack(config);
compiler.run(function(err, stats) {
  let options = {
    colors: true,
    chunks: false,
    errorDetails: true,
  };
  console.log(stats.toString(options));
});
