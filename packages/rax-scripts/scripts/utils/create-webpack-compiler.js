'use strict';
/* eslint no-console: 0 */
const webpack = require('webpack');
const colors = require('chalk');

/**
 * Create webpack compiler instance
 *
 * @param  {Object} webpackConfig webpack config
 * @return {compiler}             webpack compiler instance
 *
 * @see http://webpack.github.io/docs/plugins.html#the-compiler-instance
 */

module.exports = webpackConfig => {
  let compiler;

  try {
    compiler = webpack(webpackConfig);
  } catch (err) {
    console.error(colors.red('[ERR]: Failed to compile.'));
    console.log('');
    console.error(err.message || err);
    console.log('');
    process.exit(1);
  }

  compiler.plugin('done', stats => {
    if (stats.hasErrors()) {
      return console.error(
        stats.toString({
          colors: true
        })
      );
    }

    console.log(
      stats.toString({
        colors: true,
        chunks: false,
        assets: true
      })
    );
  });

  compiler.plugin('failed', err => {
    throw err;
  });

  return compiler;
};
