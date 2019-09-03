const path = require('path');

const { hmrClient } = require('rax-compile-config');

const UniversalAppShellLoader = require.resolve('../loaders/UniversalAppShellLoader');

module.exports = (config, context, type) => {
  const { rootDir, command } = context;
  const isDev = command === 'dev';

  // SPA
  const appEntry = path.resolve(rootDir, 'src/app.js');
  const entryConfig = config.entry('index');
  if (isDev) {
    entryConfig.add(hmrClient);
  }
  entryConfig.add(`${UniversalAppShellLoader}?type=${type}!${appEntry}`);
};
