const merge = require('webpack-merge');
const baseConfig = require('./webpack.config.dev');

const prodConfig = {
  mode: 'production',
  output: {
    filename: 'miniapp-framework-[name].min.js',
  },
};
module.exports = baseConfig.map((config) => merge(config, prodConfig));
