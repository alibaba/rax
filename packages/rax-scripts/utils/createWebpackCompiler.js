const webpack = require('webpack');
const colors = require('chalk');

/**
 * Create webpack compiler instance
 *
 * @param  {Object} config webpack config
 * @return {compiler}      webpack compiler instance
 *
 * @see http://webpack.github.io/docs/plugins.html#the-compiler-instance
 */
const options = require('./parseOptions');

module.exports = function createWebpackCompiler(config) {
  let compiler = webpack(config);

  compiler.plugin('done', stats => {
    if (stats.hasErrors()) {
      return console.log(
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

    console.log('');
    console.log('The app is running at:');
    console.log('');
    console.log(`  ${colors.cyan(`${options.protocol}//${options.host}:${options.port}/`)}`);
    console.log('');
  });

  compiler.plugin('failed', err => {
    throw err;
  });

  return compiler;
};
