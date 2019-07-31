'use strict';

const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const UNIVERSAL_APP_SHELL_LOADER = require.resolve('universal-app-shell-loader');

module.exports = (config) => {
  const appEntry = path.resolve(process.cwd(), 'src/app.js');

  config.mode('production');
  config.devtool('source-map');
  config.entry('index.web')
    .add(`${UNIVERSAL_APP_SHELL_LOADER}?type=web!${appEntry}`);

  config.optimization
    .minimize(true)
    .minimizer('uglify')
      .use(UglifyJSPlugin, [{
        include: /\.min\.js$/,
        cache: true,
        sourceMap: true,
      }])
      .end()
    .minimizer('optimizeCSS')
      .use(OptimizeCSSAssetsPlugin, [{
        canPrint: true,
      }]);
};
