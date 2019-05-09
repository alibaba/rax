'use strict';

const webpackMerge = require('webpack-merge');
const pathConfig = require('../path.config');
const webpackConfigBase = require('../webapp/webpack.config.prod');

if (webpackConfigBase.entry) {
  delete webpackConfigBase.entry;
}
delete webpackConfigBase.output.publicPath;
const webpackConfigProd = webpackMerge(webpackConfigBase, {
  entry: {
    'index.min': [pathConfig.pwaIndexJS],
  },
  output: {
    publicPath: './'
  }
});

module.exports = webpackConfigProd;
