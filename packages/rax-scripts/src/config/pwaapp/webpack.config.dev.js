'use strict';

const webpackMerge = require('webpack-merge');
const pathConfig = require('../path.config');
const webpackConfigBase = require('../webapp/webpack.config.dev');

if (webpackConfigBase.entry) {
  delete webpackConfigBase.entry;
}
const webpackConfigDev = webpackMerge(webpackConfigBase, {
  entry: {
    index: [pathConfig.pwaIndexJS],
  }
});

module.exports = webpackConfigDev;
