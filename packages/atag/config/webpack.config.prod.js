const getBase = require('./webpack.config.base');
const merge = require('webpack-merge');

const devConfig = {
  mode: 'production'
};

module.exports = getBase().then(baseConfig => merge(baseConfig, devConfig));
