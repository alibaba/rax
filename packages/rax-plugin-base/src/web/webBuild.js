'use strict';

const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UNIVERSAL_APP_SHELL_LOADER = require.resolve('universal-app-shell-loader');

module.exports = (webConfig) => {
  const appEntry = path.resolve(process.cwd(), 'src/app.js');

  webConfig.mode('production');
  webConfig.devtool('source-map');
  webConfig.entry('index.web')
    .add(`${UNIVERSAL_APP_SHELL_LOADER}?type=web!${appEntry}`);

  webConfig.optimization
    .minimize(true)
    .minimizer('uglify')
      .use(UglifyJSPlugin, [{
        include: /\.min\.js$/,
        cache: true,
        sourceMap: true,
      }])
      .end()
    .minimizer('optimizeCss')
      .use(OptimizeCSSAssetsPlugin, [{
        canPrint: true,
      }]);

  return [webConfig];
};
