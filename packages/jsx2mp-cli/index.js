const { join } = require('path');
const MemFs = require('memory-fs');
const mergeWebpack = require('webpack-merge');
const webpack = require('webpack');
const consoleClear = require('console-clear');
const chalk = require('chalk');
const del = require('del');
const chokidar = require('chokidar');

const getWebpackConfig = require('./getWebpackConfig');
const spinner = require('./utils/spinner');
const { getCurrentDirectoryPath } = require('./utils/file');
const { DEFAULT_TYPE, DEFAULT_PLATFORM, DEFAULT_ENTRY, DEFAULT_DIST, DEFAULT_CONSTANT_DIR_ARR } = require('./default');
const { copySync, existsSync, mkdirSync } = require('fs-extra');


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
    distDirectory = join(cwd, DEFAULT_DIST),
    skipClearStdout = false,
    constantDir = DEFAULT_CONSTANT_DIR_ARR,
    disableCopyNpm = false,
    turnOffCheckUpdate = false
  } = options;

  // Clean the dist dir before generating
  if (existsSync(distDirectory)) {
    del.sync(distDirectory + '/**');
  }

  constantDir.forEach(dir => copyConstantDir(dir, distDirectory));

  const needUpdate = checkNeedUpdate(turnOffCheckUpdate);

  let config = getWebpackConfig({
    mode: 'build',
    entryPath: entry,
    platform,
    type,
    workDirectory,
    distDirectory,
    constantDir,
    disableCopyNpm
  });

  if (options.webpackConfig) {
    config = mergeWebpack(config, options.webpackConfig);
  }
  spinner.shouldClear = !skipClearStdout;

  const compiler = webpack(config);
  compiler.outputFileSystem = new MemFs();
  compiler.run((err, stats) => {
    handleCompiled(err, stats, { skipClearStdout });
    afterCompiled && afterCompiled(err, stats);
    if (needUpdate) {
      console.log(chalk.black.bgYellow.bold('Update for miniapp related packages available, please reinstall dependencies.'));
    }
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
    distDirectory = join(cwd, DEFAULT_DIST),
    skipClearStdout = false,
    constantDir = DEFAULT_CONSTANT_DIR_ARR,
    disableCopyNpm = false,
    turnOffSourceMap = false,
    turnOffCheckUpdate = false
  } = options;

  watchConstantDir(constantDir, distDirectory);

  const needUpdate = checkNeedUpdate(turnOffCheckUpdate);

  let config = getWebpackConfig({
    mode: 'watch',
    entryPath: entry,
    type,
    workDirectory,
    platform,
    distDirectory,
    constantDir,
    disableCopyNpm,
    turnOffSourceMap
  });

  if (options.webpackConfig) {
    config = mergeWebpack(config, options.webpackConfig);
  }
  spinner.shouldClear = !skipClearStdout;

  const compiler = webpack(config);

  const watchOpts = {
    aggregateTimeout: 600
  };
  compiler.outputFileSystem = new MemFs();
  compiler.watch(watchOpts, (err, stats) => {
    handleCompiled(err, stats, { skipClearStdout });
    afterCompiled && afterCompiled(err, stats);
    if (needUpdate) {
      console.log(chalk.black.bgYellow.bold('Update for miniapp related packages available, please reinstall dependencies.'));
    }
    console.log('Watching for changes...');
  });
}

function handleCompiled(err, stats, { skipClearStdout }) {
  if (err) {
    console.error(err.stack || err);
    if (err.details) {
      console.error(err.details);
    }
    return;
  }
  if (stats.hasErrors()) {
    const errors = stats.compilation.errors;
    if (!skipClearStdout) consoleClear(true);
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

/**
 * watch and copy constant dir file change
 * @param {array} dirs
 * @param {string} distDirectory
 */
function watchConstantDir(dirs, distDirectory) {
  const watcher = chokidar.watch(dirs);
  watcher.on('all', (event, path) => {
    copyConstantDir(path, distDirectory);
  });
}

/**
 * copy constant path to dist
 * @param {string} path
 * @param {string} distDirectory
 */
function copyConstantDir(path, distDirectory) {
  if (!path) {
    return;
  }
  if (!existsSync(path)) {
    mkdirSync(path);
  }
  copySync(path, join(distDirectory, getCurrentDirectoryPath(path, 'src')), {
    filter: (filename) => !/\.ts$/.test(filename),
  });
}

function checkNeedUpdate(turnOff) {
  if (turnOff) {
    return false;
  }
  return require('./checkPkgVersion');
}

exports.build = build;
exports.watch = watch;
exports.getWebpackConfig = getWebpackConfig;
