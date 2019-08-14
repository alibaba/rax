'use strict';

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const setEntry = require('../setEntry');

module.exports = (config, context) => {
  config.mode('production');
  config.devtool('source-map');

  setEntry(config, context, 'weex');

  config.optimization
    .minimizer('uglify')
      .use(UglifyJSPlugin, [{
        cache: true,
        sourceMap: true,
      }])
      .end()
    .minimizer('optimizeCSS')
      .use(OptimizeCSSAssetsPlugin, [{
        canPrint: true,
      }]);
};
