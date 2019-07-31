'use strict';

const webpack = require('webpack');

module.exports = (config) => {
  config.mode('development');
  config.devtool('inline-module-source-map');

  config.plugin('noError')
    .use(webpack.NoEmitOnErrorsPlugin);
};
