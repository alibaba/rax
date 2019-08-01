const MemFs = require('memory-fs');
const config = require('./webpack.config');
const webpack = require('webpack');

function build() {
  const compiler = webpack(config);
  compiler.outputFileSystem = new MemFs();
  compiler.run(handleCompiled)
}

function watch() {
  const compiler = webpack(config);
  const watchOpts = {};
  compiler.outputFileSystem = new MemFs();
  compiler.watch(watchOpts, handleCompiled);
}

function handleCompiled(err, stats) {
  if (err) {
    console.error(err);
  } else {
    console.log(
      stats.toString({
        colors: true
      })
    );
  }
}

exports.build = build;
exports.watch = watch;
