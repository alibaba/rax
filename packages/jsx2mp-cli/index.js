const { join } = require('path');
const MemFs = require('memory-fs');
const mergeWebpack = require('webpack-merge');
const webpack = require('webpack');
const consoleClear = require('console-clear');
const chalk = require('chalk');
const getWebpackConfig = require('./getWebpackConfig');
const spinner = require('./utils/spinner');
const { DEFAULT_TYPE, DEFAULT_PLATFORM, DEFAULT_ENTRY, DEFAULT_DIST } = require('./default');

const cwd = process.cwd();

/**
 * Start jsx2mp build.
 * @param options
 */
function build(options = {}) {
  const {
    afterCompiled,
    type = DEFAULT_TYPE,
    entry = DEFAULT_ENTRY,
    platform = DEFAULT_PLATFORM,
    workDirectory = cwd,
    distDirectory = join(cwd, DEFAULT_DIST)
  } = options;

  let config = getWebpackConfig({
    mode: 'build',
    entryPath: entry,
    platform,
    type,
    workDirectory,
    distDirectory
  });

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
  const {
    afterCompiled,
    type = DEFAULT_TYPE,
    entry = DEFAULT_ENTRY,
    platform = DEFAULT_PLATFORM,
    workDirectory = cwd,
    distDirectory = join(cwd, DEFAULT_DIST)
  } = options;

  let config = getWebpackConfig({
    mode: 'watch',
    entryPath: entry,
    type,
    workDirectory,
    platform,
    distDirectory,
  });

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
