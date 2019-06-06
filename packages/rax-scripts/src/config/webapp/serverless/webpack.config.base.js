'use strict';

const path = require('path');
const qs = require('querystring');
const webpackMerge = require('webpack-merge');
const webpackConfigBase = require('../webpack.config.base');
const babelConfig = require('../../babel.config');
const pathConfig = require('../../path.config');
const getEntries = require('../../../utils/getEntries');

const ServerlessLoader = require.resolve('rax-ssr-webpack-plugin/lib/ServerlessLoader');

const entries = getEntries();
const appDirectory = pathConfig.appDirectory;
const outputPath = webpackConfigBase.output.publicPath;

const pages = {};
Object.keys(entries).map((entry) => {
  if (entry.indexOf('_') > -1) {
    return;
  }

  const entryPath = entries[entry];
  const absoluteEntryPath = path.join(appDirectory, entryPath);
  const query = {
    page: entry,
    appPath: absoluteEntryPath,
    appConfigPath: pathConfig.appConfig,
    appDocumentPath: entries._document ? entries._document : '',
    appShellPath: entries._shell ? entries._shell : '',
    publicPath: outputPath,
  };

  pages[entry] = `${ServerlessLoader}?${qs.stringify(query)}!${entries[entry]}`;
});

const webpackConfig = webpackMerge(webpackConfigBase, {
  target: 'node',
  entry: pages,
  output: {
    filename: 'serverless/[name].js',
    libraryTarget: 'commonjs2',
  },
  resolve: {
    alias: {
      'rax-server': require.resolve('rax-server')
    }
  },
  module: {
    rules: [{
      test: /\.(js|mjs|jsx)$/,
      exclude: /(node_modules|bower_components)/,
      use: [
        {
          loader: require.resolve('babel-loader'),
          options: babelConfig,
        },
        {
          loader: require.resolve('rax-webpack-plugin/lib/PlatformLoader'),
          options: {
            platform: 'node'
          }
        },
      ],
    }]
  }
});

module.exports = webpackConfig;
