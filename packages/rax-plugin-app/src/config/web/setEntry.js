const path = require('path');
const { readFileSync } = require('fs');

const hmrClient = require.resolve('../../hmr/webpackHotDevClient.entry');
const UNIVERSAL_APP_SHELL_LOADER = require.resolve('universal-app-shell-loader');

module.exports = (config, rootDir, userConfig, isDev = false) => {
  const appEntry = path.resolve(rootDir, 'src/app.js');

  if (userConfig.spa === false) {
    // MPA
    let routes = JSON.parse(readFileSync(path.resolve(rootDir, 'src/app.json'), 'utf-8')).routes;
    if (!Array.isArray(routes)) {
      this.emitError(new Error('Unsupported field in app.json: routes.'));
      routes = [];
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