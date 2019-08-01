const MemFs = require('memory-fs');
const config = require('./webpack.config');
const webpack = require('webpack');

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
    console.log(err);
  } else {
    console.log(stats.toString('errors-only'));
  }
}

exports.build = build;
exports.watch = watch;
