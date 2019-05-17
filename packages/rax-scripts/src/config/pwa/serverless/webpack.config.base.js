'use strict';

const path = require('path');
const qs = require('querystring');
const webpackMerge = require('webpack-merge');
const webpackConfigBase = require('../webpack.config.base');
const pathConfig = require('../../path.config');
const getEntries = require('../../../utils/getPWAEntries');

const ServerlessLoader = require.resolve('rax-ssr-webpack-plugin/lib/ServerlessLoader');

const entries = getEntries();
const appDirectory = pathConfig.appDirectory;
const templatePath = pathConfig.appHtml;
const raxServerPath = require.resolve('rax-server');

Object.keys(entries).map((entry) => {
  const entryPath = entries[entry];
  const absoluteEntryPath = path.join(appDirectory, entryPath);

  const query = {
    page: entry,
    appPath: absoluteEntryPath,
    templatePath,
    raxServerPath
  };

  entries[entry] = `${ServerlessLoader}?${qs.stringify(query)}!${entries[entry]}`;
});

const webpackConfig = webpackMerge(webpackConfigBase, {
  target: 'node',
  entry: entries,
  output: {
    filename: 'serverless/[name].js',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [{
      test: /\.(html)$/,
      use: {
        loader: require.resolve('html-loader')
      }
    }]
  }
});

module.exports = webpackConfig;
