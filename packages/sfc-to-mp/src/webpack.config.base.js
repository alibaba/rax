const path = require('path');
const getAppJSON = require('./config/getAppJSON');
const getEntry = require('./config/getEntry');

const cwd = process.cwd();

const appJSON = getAppJSON(cwd);
const entry = getEntry(cwd, appJSON);
const context = path.resolve(cwd, appJSON.root || '');

module.exports = {
  devtool: false,
  resolve: {
    alias: {
      'webpack-hot-client/client': require.resolve('webpack-hot-client/client'),
    },
    extensions: ['.js', '.json', '.html', 'vue'],
  },
  context,
  entry,
  output: {
    path: path.resolve(cwd, process.env.OUTPUT || 'dist'),
  },
  // external all
  externals: [
    function(context, request, callback) {
      if (/^.?\/assets/.test(request)) {
        return callback(null, `commonjs2 ${request}`);
      }
      callback();
    },
  ],
  resolve: {
    alias: {
      '@': context,
    },
  },
};
