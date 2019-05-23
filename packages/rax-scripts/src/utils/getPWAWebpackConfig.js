const pathConfig = require('../config/path.config');

const webpackConfigMap = {
  'prod': {
    client: '../config/pwa/client/webpack.config.prod',
    server: '../config/pwa/server/webpack.config.prod',
    serverless: '../config/pwa/serverless/webpack.config.prod'
  },
  'dev': {
    client: '../config/pwa/client/webpack.config.dev',
    server: '../config/pwa/server/webpack.config.dev',
    serverless: '../config/pwa/serverless/webpack.config.dev'
  }
};

module.exports = (env = 'prod') => {
  const appJSON = require(pathConfig.appJSON);
  const config = webpackConfigMap[env];

  let result = [
    require(config.client)
  ];

  if (appJSON.ssr) {
    result.push(require(config.server));
  }
  if (appJSON.serverless) {
    result.push(require(config.serverless));
  }

  return result;
};