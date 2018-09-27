const { readFileSync } = require('fs');
const path = require('path');
const webpackMerge = require('webpack-merge');

const getEntry = require('./config/getEntry');

const cwd = process.cwd();
module.exports = {
  mode: 'development',
  devtool: false,
  resolve: {
    alias: {
      '@': cwd,
      'webpack-hot-client/client': require.resolve(
        'webpack-hot-client/client'
      ),
    },
    extensions: ['.js', '.json', '.html', 'vue'],
  },
  context: cwd,
  entry: getEntry(),
  output: {
    path: path.resolve(cwd, process.env.OUTPUT || 'dist'),
  },
  externals: [
    function(context, request, callback) {
      if (/^.?\/sources/.test(request)) {
        return callback(null, `commonjs2 ${request}`);
      }
      callback();
    },
    function(context, request, callback) {
      if (/^.?\/(vendors|sources)/.test(request)) {
        return callback(null, `commonjs2 ${request}`);
      } else {
        return callback();
      }
    },
  ],
};
