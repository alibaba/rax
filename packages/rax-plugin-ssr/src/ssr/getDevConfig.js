'use strict';
const path = require('path');
const address = require('address');
const getBaseWebpackConfig = require('./getBaseConfig');

function setDevServerConfig(config, rootDir) {
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
  config.devServer.port(9999);
  config.devServer.host(address.ip());
  config.devServer.set('routes', routes);
}

module.exports = (context) => {
  const config = getBaseWebpackConfig(context);

  config.mode('development');

  setDevServerConfig(config, context.rootDir);

  return config;
};
