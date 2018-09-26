const webpack = require('webpack');
const log = require('fancy-log');
const colors = require('chalk');

// const webpackConfig = require('./webpack.config.dev');
const vendorConfig = require('./vendor.config');

const statsOptions = {
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

module.exports = function watch() {
  const watchOpts = {
    aggregateTimeout: 300,
  };
  console.log(vendorConfig);
  const compiler = webpack([vendorConfig /* , webpackConfig */]);

  compiler.watch(watchOpts, (err, stats) => {
    const hasErr = stats.stats.reduce((prev, curr) => prev || curr.hasErrors(), false);
    if (hasErr) {
      stats.stats.forEach((stats) => {
        console.log(stats.toString(statsOptions));
      });
      log(colors.red('Compiled with Error.'));
    } else if (err) {
      log.error(err);
    } else {
      console.log(stats.toString(statsOptions));
      log(colors.green('Compile Succeed. Watching changes.'));
    }
  });
};
