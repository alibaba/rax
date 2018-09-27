const webpack = require('webpack');
const path = require('path');

const vendors = require('./config/vendors');

module.exports = {
  mode: 'development',
  entry: {
    'vendors/createApp': vendors.createApp,
    'vendors/createPage': vendors.createPage,
    'vendors/coreApp': vendors.coreApp,
    'vendors/sfc': vendors.sfc,
  },
  output: {
    path: path.resolve(process.cwd(), process.env.OUTPUT || 'dist'),
    libraryTarget: 'commonjs2',
  },
  node: {
    global: false,
  },
  externals: {
    sfc: 'commonjs2 /assets/vendor/sfc',
  },
  devtool: false,
  plugins: [
    // vue need to access global.process.env.VUE_ENV
    new webpack.DefinePlugin({
      'global.process.env.VUE_ENV': 'browser',
    }),
  ],
};
