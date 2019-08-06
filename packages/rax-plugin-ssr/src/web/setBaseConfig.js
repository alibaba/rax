'use strict';
const path = require('path');

const UNIVERSAL_APP_SHELL_LOADER = require.resolve('universal-app-shell-loader');

module.exports = (config, rootDir) => {
  const appEntry = path.resolve(rootDir, 'src/app.js');

  // remove hmrClient
  config.entry('index').clear();

  config.entry('index')
  .add(`${UNIVERSAL_APP_SHELL_LOADER}?type=web!${appEntry}`);

  return config;
};
