'use strict';
/* eslint no-console: 0 */
const colors = require('chalk');
const path = require('path');
const pathExists = require('path-exists');

/**
 * Method for providing user to modify webpack config
 * apply webpackConfig to path.join(process.cwc(), webpack.config.update.js);
 *
 * @param  {Object} webpackConfig webpack config
 * @return {Object}               webpack cofnig with webpack.config.update.js
 */
module.exports = webpackConfig => {
  const UPDATE_FILE_NAME = 'webpack.config.update.js';
  const webpackConfigUpdatePath = path.join(process.cwd(), UPDATE_FILE_NAME);

  if (pathExists.sync(webpackConfigUpdatePath)) {
    console.log('');
    console.info(colors.yellow('Update webpack config from:'));
    console.info(webpackConfigUpdatePath);
    console.log('');
    let webpackConfigUpdateRef;
    try {
      webpackConfigUpdateRef = require(webpackConfigUpdatePath);
    } catch (err) {
      throw err;
    }

    if (typeof webpackConfigUpdateRef !== 'function') {
      console.error(colors.red(`[ERR]: ${UPDATE_FILE_NAME} must be export a function.`));
      console.info(
        'see',
        colors.underline.white(
          'https://github.com/alibaba/rax/blob/master/packages/rax-scripts/README.md#update-webpack-config'
        )
      );
      process.exit(1);
    } else {
      const webpackConfigUpdated = webpackConfigUpdateRef(webpackConfig);

      if (!webpackConfigUpdated) {
        console.error(`[ERR]: ${UPDATE_FILE_NAME} must be return an object of webpack config.`);
        console.info(
          'see',
          colors.underline.white(
            'https://github.com/alibaba/rax/blob/master/packages/rax-scripts/README.md#update-webpack-config'
          )
        );
        process.exit(1);
      }
      return webpackConfigUpdated;
    }
  } else {
    return webpackConfig;
  }
};
