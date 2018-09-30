const path = require('path');
const getEntry = require('./config/getEntry');
const { getOption } = require('./config/cliOptions');

const cwd = process.cwd();

module.exports = {
  mode: 'development',
  devtool: false,
  resolve: {
    alias: {
      'webpack-hot-client/client': require.resolve('webpack-hot-client/client'),
    },
    extensions: ['.js', '.json', '.html', 'vue'],
  },
  context: cwd,
  entry: getEntry(),
  output: {
    path: path.resolve(cwd, getOption('output')),
  },
  externals: [
    function(context, request, callback) {
      if (/^.?\/(vendors|sources)/.test(request)) {
        return callback(null, `commonjs2 ${request}`);
      } else {
        return callback();
      }
    },
  ],
};
