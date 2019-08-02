const MemFs = require('memory-fs');
const config = require('./webpack.config');
const webpack = require('webpack');
const spinner = require('./utils/spinner');
const consoleClear = require('console-clear');
const chalk = require('chalk');

function setEnv(type) {
  process.env.JSX2MP_ENV = type;
}

function build() {
  setEnv('build');
  const compiler = webpack(config);
  compiler.outputFileSystem = new MemFs();
  compiler.run(handleCompiled);
}

function watch() {
  setEnv('dev');
  const compiler = webpack(config);
  const watchOpts = {};
  compiler.outputFileSystem = new MemFs();
  compiler.watch(watchOpts, handleCompiled);
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
    consoleClear();
    for (let e of errors) {
      spinner.fail('Failed to compile.\n\n' + e.error.message + '\n');
      if (process.env.DEBUG === 'true') {
        console.log(e.error.stack);
      }
      console.log(chalk.yellow('You can set debug mode to show error stacks.'))
    }
  }
}

exports.build = build;
exports.watch = watch;
