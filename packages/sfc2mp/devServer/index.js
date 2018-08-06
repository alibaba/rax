const webpack = require('webpack');
const colors = require('colors');
const log = require('fancy-log');
const getWebpackConfig = require('../config');

/**
 * start dev server
 */
module.exports = function startDevServer(rootDir) {
  const watchOpts = {
    aggregateTimeout: 300,
  };

  return getWebpackConfig(rootDir)
    .then(config => {
      const compiler = webpack(config);
      return compiler.watch(watchOpts, (err, stats) => {
        const hasErr = stats.stats.reduce((prev, curr) => prev || curr.hasErrors(), false);
        if (hasErr) {
          const opt = {
            colors: true,
            entrypoint: false,
            hash: false,
            modules: false,
            entrypoints: false,
            assets: false,
            version: false,
            builtAt: false,
            timings: false,
          };
          stats.stats.forEach((stats) => {
            console.log(stats.toString(opt));
          });
          log(colors.red('Compiled with Error.'));
        } else if (err) {
          log.error(err);
        } else {
          log(colors.green('Compile Succeed. Watching changes.'));
        }
      });
    });
};
