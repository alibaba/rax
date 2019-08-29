const path = require('path');

const { hmrClient } = require('rax-compile-config');

const UNIVERSAL_APP_SHELL_LOADER = require.resolve('universal-app-shell-loader');

module.exports = (config, context, type) => {
  const { rootDir, command } = context;
  const isDev = command === 'dev';

  // SPA
  const appEntry = path.resolve(rootDir, 'src/app.js');
  const entryConfig = config.entry('index');
  if (isDev) {
    entryConfig.add(hmrClient);
  }
  entryConfig.add(`${UNIVERSAL_APP_SHELL_LOADER}?type=${type}!${appEntry}`);
};
