const webpack = require('webpack');
const path = require('path');

const vendors = require('./config/vendors');

module.exports = {
  mode: 'development',
  entry: {
    'assets/vendor/transAppConfig': vendors.transAppConfig,
    'assets/vendor/transPageConfig': vendors.transPageConfig,
    'assets/vendor/coreApp': vendors.coreApp,
    'assets/vendor/vue': require.resolve('vue/dist/vue.runtime.common'),
  },
  output: {
    path: path.resolve(process.cwd(), process.env.OUTPUT || 'dist'),
    libraryTarget: 'commonjs2',
  },
  node: {
    global: false,
  },
  externals: {
    vue: 'commonjs2 /assets/vendor/vue',
  },
  devtool: false,
  plugins: [
    // vue need to access global.process.env.VUE_ENV
    new webpack.DefinePlugin({
      'global.process.env.VUE_ENV': 'browser',
    }),
  ],
};
