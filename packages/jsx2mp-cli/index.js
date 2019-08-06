const MemFs = require('memory-fs');
const getWebpackConfig = require('./getWebpackConfig');
const mergeWebpack = require('webpack-merge');
const webpack = require('webpack');
const spinner = require('./utils/spinner');
const consoleClear = require('console-clear');
const chalk = require('chalk');

/**
 * Start jsx2mp build.
 * @param options
 */
function build(options = {}) {
  const { afterCompiled } = options;
  let config = getWebpackConfig({ mode: 'build' });
  if (options.webpackConfig) {
    config = mergeWebpack(config, options.webpackConfig);
  }
  const compiler = webpack(config);
  compiler.outputFileSystem = new MemFs();
  compiler.run((...args) => {
    handleCompiled(...args);
    afterCompiled && afterCompiled(...args);
  });
}

/**
 * Start webpack watch mode.
 * @param options
 */
function watch(options = {}) {
  const { afterCompiled } = options;
  let config = getWebpackConfig({ mode: 'watch' });
  if (options.webpackConfig) {
    config = mergeWebpack(config, options.webpackConfig);
  }
  const compiler = webpack(config);
  const watchOpts = {};
  compiler.outputFileSystem = new MemFs();
  compiler.watch(watchOpts, (...args) => {
    handleCompiled(...args);
    afterCompiled && afterCompiled(...args);
    console.log('\nWatching file changes...');
  });
}

function handleCompiled(err, stats) {
  if (err) {
    console.error(err.stack || err);
    if (err.details) {
      console.error(err.details);
    }
    return;
  }
  if (stats.hasErrors()) {
    const errors = stats.compilation.errors;
    consoleClear(true);
    spinner.fail('Failed to compile.\n');
    for (let e of errors) {
      console.log(chalk.red(`    ${errors.indexOf(e) + 1}. ${e.error.message} \n`));
      if (process.env.DEBUG === 'true') {
        console.log(e.error.stack);
      }
    }
    console.log(chalk.yellow('Set environment `DEBUG=true` to see detail error stacks.'));
  }
}

exports.build = build;
exports.watch = watch;
exports.getWebpackConfig = getWebpackConfig;
