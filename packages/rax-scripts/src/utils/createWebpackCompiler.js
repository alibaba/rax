'use strict';
/* eslint no-console: 0 */
const colors = require('chalk');

const updateWebpackConfig = require('./updateWebpackConfig');
const webpack = require('webpack');

/**
 * Create webpack compiler instance
 *
 * @param  {Object} webpackConfig webpack config
 * @return {compiler}             webpack compiler instance
 *
 * @see http://webpack.github.io/docs/plugins.html#the-compiler-instance
 */
module.exports = (webpackConfig) => {
  let compiler;

  const config = updateWebpackConfig(webpackConfig);

  try {
    compiler = webpack(config);
  } catch (err) {
    console.error(colors.red('[ERR]: Failed to compile.'));
    console.log('');
    console.error(err.message || err);
    console.log('');
    process.exit(1);
  }

  compiler.hooks.done.tap('done', (stats) => {
    if (stats.hasErrors()) {
      return console.error(
        stats.toString({
          colors: true,
        }),
      );
    }

    console.log(
      stats.toString({
        assets: true,
        colors: true,
        children: false,
        chunks: false,
        entrypoints: false,
        modules: false,
      }),
    );
  });

  compiler.hooks.failed.call('failed', (err) => {
    throw err;
  });

  return compiler;
};
