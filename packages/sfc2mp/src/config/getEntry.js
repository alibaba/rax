const { readFileSync } = require('fs');
const path = require('path');

const appLoaderPath = require.resolve('../loaders/app-loader');
const pageLoaderPath = require.resolve('../loaders/page-loader');

const SFC_EXT = '.html';
const APP_ENTRY_PATH = 'app.js';
const MANIFEST_ENTRY_PATH = 'manifest.json';

const context = process.cwd();
const appPath = path.resolve(context, APP_ENTRY_PATH);
const manifestPath = path.resolve(context, MANIFEST_ENTRY_PATH);
const appConfig = JSON.parse(readFileSync(manifestPath, 'utf-8'));

module.exports = function getEntry() {
  const entry = {};

  entry.app = appLoaderPath + '!' + appPath;

  const { pages } = appConfig;
  if (pages) {
    Object.keys(pages).forEach((pageName) => {
      const pagePath = pages[pageName];
      const pageEntryPath = path.resolve(context, pagePath);
      entry[pagePath] = `${pageLoaderPath}!${pageEntryPath}${SFC_EXT}`;
    });
  }
  return entry;
};
