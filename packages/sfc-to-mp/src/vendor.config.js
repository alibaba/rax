const webpack = require('webpack');
const path = require('path');

const vendors = require('./config/vendors');
const { OUTPUT_VENDOR_FOLDER } = require('./config/CONSTANTS');

module.exports = {
  mode: 'development',
  entry: {
    [`${OUTPUT_VENDOR_FOLDER}/createApp`]: vendors.createApp,
    [`${OUTPUT_VENDOR_FOLDER}/createPage`]: vendors.createPage,
    [`${OUTPUT_VENDOR_FOLDER}/coreApp`]: vendors.coreApp,
    [`${OUTPUT_VENDOR_FOLDER}/sfc`]: vendors.sfc,
  },
  output: {
    path: path.resolve(process.cwd(), process.env.OUTPUT || 'dist'),
    libraryTarget: 'commonjs2',
  },
  node: {
    global: false,
  },
  externals: {
    sfc: `commonjs2 /${OUTPUT_VENDOR_FOLDER}/sfc`,
  },
  devtool: false,
  plugins: [
    // vue need to access global.process.env.VUE_ENV
    new webpack.DefinePlugin({
      'global.process.env.VUE_ENV': 'browser',
    }),
  ],
};
