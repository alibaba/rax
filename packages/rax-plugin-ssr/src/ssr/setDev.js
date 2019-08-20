'use strict';
const path = require('path');

module.exports = (config, context) => {
  const { rootDir } = context;

  config.mode('development');

  const absoluteAppJSONPath = path.join(rootDir, 'src/app.json');
  const appJSON = require(absoluteAppJSONPath);

  const distDir = config.output.get('path');
  const filename = config.output.get('filename');

  const routes = {};

  appJSON.routes.forEach((route) => {
    const pathName = route.name || route.component.replace(/\//g, '_');
    routes[route.path] = path.join(distDir, filename.replace('[name]', pathName));
  });

  config.devServer.hot(false);
  config.devServer.set('routes', routes);

  return config;
};
