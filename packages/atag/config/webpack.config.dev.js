const getBase = require('./webpack.config.base');
const merge = require('webpack-merge');

const devConfig = {
  mode: 'development',
  devtool: 'inline-source-map'
};

module.exports = getBase().then(baseConfig => merge(baseConfig, devConfig));
