'use strict';

const path = require('path');
const qs = require('querystring');
const webpackMerge = require('webpack-merge');
const getWebpackConfigBase = require('../webpack.config.base');
const pathConfig = require('../../path.config');
const { getEntries } = require('../../index');
const envConfig = require('../../env.config');

const ServerlessLoader = require.resolve('rax-pwa-webpack-plugin/lib/ServerlessLoader');

const webpackConfigBase = getWebpackConfigBase({
  target: 'web'
});

const entries = getEntries();
const appDirectory = pathConfig.appDirectory;

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
    styles: [`${envConfig.publicPath}client/${entry}.css`],
    scripts: [`${envConfig.publicPath}client/${entry}.js`],
  };

  pages[entry] = `${ServerlessLoader}?${qs.stringify(query)}!${entries[entry]}`;
});

const webpackConfig = webpackMerge(webpackConfigBase, {
  entry: pages,
  output: {
    filename: 'serverless/[name].js',
    libraryTarget: 'commonjs2',
  },
  resolve: {
    alias: {
      'rax-server': require.resolve('rax-server')
    }
  }
});

module.exports = webpackConfig;
