const path = require('path');
const fs = require('fs-extra');

const hmrClient = require.resolve('../../hmr/webpackHotDevClient.entry');
const UNIVERSAL_APP_SHELL_LOADER = require.resolve('universal-app-shell-loader');

module.exports = (config, rootDir, userConfig, isDev = false) => {
  const appEntry = path.resolve(rootDir, 'src/app.js');

  if (userConfig.spa === false) {
    // MPA
    let routes = [];

    try {
      routes = fs.readJsonSync(path.resolve(rootDir, 'src/app.json')).routes;
    } catch (e) {
      console.error(e);
      throw new Error('routes in app.json must be array');
    }

    routes.forEach((route, index) => {
      const entryConfig = config.entry(route.component.replace(/pages\/([^\/]*)\/index/g, (str, $) => $));
      if (isDev) {
        entryConfig.add(hmrClient);
      }
      entryConfig.add(`${UNIVERSAL_APP_SHELL_LOADER}?type=web&isMultiPageWebApp=true&routeIndex=${index}!${appEntry}`);
    });
  } else {
    // SPA
    const entryConfig = config.entry('index');
    if (isDev) {
      entryConfig.add(hmrClient);
    }
    entryConfig.add(`${UNIVERSAL_APP_SHELL_LOADER}?type=web!${appEntry}`);
  }
};
