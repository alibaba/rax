'use strict';

const qs = require('querystring');
const webpackMerge = require('webpack-merge');
const webpackConfigBase = require('../webpack.config.base');
const getEntries = require('../../../utils/getPWAEntries');

let entry = {};
const entries = getEntries();
const entryLoader = require.resolve('rax-ssr-webpack-plugin/lib/EntryLoader');
Object.keys(entries).forEach((key) => {
  // TODO: read config file set ssr value
  entry[key] = `${entryLoader}?${qs.stringify({ ssr: true })}!${entries[key]}`;
});

const webpackConfig = webpackMerge(webpackConfigBase, {
  target: 'web',
  entry,
  output: {
    filename: 'client/[name].js'
  }
});

module.exports = webpackConfig;
