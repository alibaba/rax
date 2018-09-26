const webpackMerge = require('webpack-merge');
const webpackConfigBase = require('./webpack.config.base');

module.exports = webpackMerge(webpackConfigBase, {
  mode: 'development',
});
