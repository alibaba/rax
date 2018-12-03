const webpack = require('webpack');
const path = require('path');

const vendors = require('./config/vendors');
const { getOption } = require('./config/cliOptions');
const { OUTPUT_VENDOR_FOLDER } = require('./config/CONSTANTS');

module.exports = {
  mode: 'development',
  entry: {
    createApp: vendors.createApp,
    createPage: vendors.createPage,
    coreApp: vendors.coreApp,
    'sfc-runtime': vendors.sfcRuntime,
  },
  output: {
    path: path.join(process.cwd(), getOption('output'), OUTPUT_VENDOR_FOLDER),
    libraryTarget: 'commonjs2',
  },
  node: {
    global: false,
  },
  externals: {
    'sfc-runtime': 'commonjs2 ./sfc-runtime',
  },
  devtool: false,
  plugins: [
    // vue need to access global.process.env.VUE_ENV
    new webpack.ProgressPlugin(),
    new webpack.DefinePlugin({
      'global.process.env.VUE_ENV': 'browser',
    }),
  ],
};
