const log = require('fancy-log');

const { resolve } = require('path');
const { existsSync } = require('fs');

const appLoader = require.resolve('../loaders/app-loader');
const pageLoader = require.resolve('../loaders/page-loader');

module.exports = function getEntry(rootDir, appJSON = {}) {
  const appPath = resolve(rootDir, appJSON.root || '', 'app.js');
  if (!existsSync(appPath)) {
    throw new Error('app.js not exists');
  }

  const entry = {
    app: appLoader + '!' + appPath,
  };

  if (Array.isArray(appJSON.pages)) {
    log('Page List:', appJSON.pages);
    appJSON.pages.forEach((pagePath) => {
      entry[pagePath] =
        pageLoader + `?pageName=${pagePath}!` + resolve(rootDir, appJSON.root || '', pagePath + '.html');
    });
  }

  return entry;
};
