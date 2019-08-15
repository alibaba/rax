const path = require('path');
const fs = require('fs-extra');

const { hmrClient } = require('rax-compile-config');

const MulitPageLoader = require.resolve('../loaders/MulitPageLoader');
const UNIVERSAL_APP_SHELL_LOADER = require.resolve('universal-app-shell-loader');

function getDepPath(rootDir, com) {
  if (com[0] === '/') {
    return path.join(rootDir, 'src', com);
  } else {
    return path.resolve(rootDir, 'src', com);
  }
};

module.exports = (config, context, type) => {
  const { rootDir, userConfig, command } = context;
  const isDev = command === 'dev';

  if (userConfig.spa === false) {
    // MPA
    let routes = [];

    try {
      routes = fs.readJsonSync(path.resolve(rootDir, 'src/app.json')).routes;
    } catch (e) {
      console.error(e);
      throw new Error('routes in app.json must be array');
    }

    routes.forEach((route) => {
      const entryConfig = config.entry(route.component.replace(/pages\/([^\/]*)\/index/g, (str, $) => $));
      if (isDev) {
        entryConfig.add(hmrClient);
      }

      const pageEntry = getDepPath(rootDir, route.component);
      entryConfig.add(`${MulitPageLoader}?type=${type}!${pageEntry}`);
    });
  } else {
    // SPA
    const appEntry = path.resolve(rootDir, 'src/app.js');
    const entryConfig = config.entry('index');
    if (isDev) {
      entryConfig.add(hmrClient);
    }
    entryConfig.add(`${UNIVERSAL_APP_SHELL_LOADER}?type=${type}!${appEntry}`);
  }
};
