const path = require('path');
const { readFileSync } = require('fs');
const webpackMerge = require('webpack-merge');
const webpackConfigBase = require('./webpack.config.base');

const appLoaderPath = require.resolve('./loaders/app-loader');
const pageLoaderPath = require.resolve('./loaders/page-loader');

const SFC_EXT = '.html';
const APP_ENTRY_PATH = 'app.js';
const MANIFEST_ENTRY_PATH = 'manifest.json';

const context = process.cwd();
const appPath = path.resolve(context, APP_ENTRY_PATH);
const manifestPath = path.resolve(context, MANIFEST_ENTRY_PATH);
const appConfig = JSON.parse(readFileSync(manifestPath, 'utf-8'));

function getEntry() {
  const entry = {};

  entry.app = appLoaderPath + '!' + appPath;

  const { pages } = appConfig;
  if (pages) {
    Object.keys(pages).forEach(pageName => {
      const pagePath = pages[pageName];
      const pageEntryPath = path.resolve(context, pagePath);
      entry[pagePath] =
        pageLoaderPath +
        '?pageName=' +
        pagePath +
        '!' +
        pageEntryPath +
        SFC_EXT;
    });
  }
  console.log(entry);
  return entry;
}

module.exports = webpackMerge(webpackConfigBase, {
  mode: 'development',
  context,
  entry: getEntry(),
  externals: [
    function(context, request, callback) {
      if (/^.?\/(vendors|sources)/.test(request)) {
        return callback(null, `commonjs2 ${request}`);
      } else {
        return callback();
      }
    },
  ],
  resolve: {
    alias: {
      '@': context,
    },
  },
});
