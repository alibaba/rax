const webpack = require('webpack');
const log = require('fancy-log');
const colors = require('chalk');
const rimraf = require('rimraf');

const appBuildConfig = require('./webpack.config');
const vendorConfig = require('./vendor.config');

const statsOptions = {
  colors: true,
  entrypoint: false,
  hash: false,
  modules: false,
  entrypoints: false,
  assets: true,
  version: false,
  builtAt: false,
  timings: false,
};

module.exports = function watch() {
  log.info(colors.blue('Clean output folder:'), appBuildConfig.output.path);
  rimraf.sync(appBuildConfig.output.path);
  const watchOpts = { aggregateTimeout: 300 };

  const compiler = webpack([vendorConfig, appBuildConfig]);

  compiler.watch(watchOpts, (err, statsQueue) => {
    const hasErr = statsQueue.stats.reduce(
      (prev, curr) => prev || curr.hasErrors(),
      false
    );
    if (hasErr) {
      statsQueue.stats.forEach((stats) => {
        console.log(stats.toString(statsOptions));
      });
      log(colors.red('Compiled with Error.'));
    } else if (err) {
      log.error(err);
    } else {
      statsQueue.stats.forEach((stats) => {
        console.log(stats.toString(statsOptions));
      });
      log(colors.green('Compile Succeed. Watching changes.'));
    }
  });
};
