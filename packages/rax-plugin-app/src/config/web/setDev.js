'use strict';

const path = require('path');
const address = require('address');
const babelMerge = require('babel-merge');

const setEntry = require('./setEntry');

module.exports = (config, context) => {
  const { rootDir, userConfig } = context;
  const { publicPath } = userConfig;

  config.mode('development');
  config.devtool('inline-module-source-map');

  config.module.rule('jsx')
    .use('babel')
    .tap(options => babelMerge.all([{
      plugins: [require.resolve('rax-hot-loader/babel')],
    }, options]));

  config.module.rule('tsx')
    .use('babel')
    .tap(options => babelMerge.all([{
      plugins: [require.resolve('rax-hot-loader/babel')],
    }, options]));

  setEntry(config, rootDir, userConfig, true);

  config.devServer
    .compress(true)
    .clientLogLevel('error')
    .contentBase(path.resolve(rootDir, 'build'))
    .watchContentBase(true)
    .hot(true)
    .quiet(true)
    .publicPath(publicPath)
    .overlay(false)
    .host(address.ip())
    .public(address.ip());
};
