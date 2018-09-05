const getBase = require('./webpack.config.base');
const merge = require('webpack-merge');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const devConfig = {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    // new BundleAnalyzerPlugin({
    //   analyzerPort: 8876
    // })
  ]
};

module.exports = getBase().then(baseConfig => merge(baseConfig, devConfig));
