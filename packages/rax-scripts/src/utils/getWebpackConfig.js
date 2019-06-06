const getAppConfig = require('./getAppConfig');

const webpackConfigMap = {
  webapp: {
    client: '../config/webapp/client/webpack.config',
    server: '../config/webapp/server/webpack.config',
    serverless: '../config/webapp/serverless/webpack.config'
  },
  weexapp: '../config/weexapp/webpack.config',
  component: '../config/component/webpack.config',
};

module.exports = (type, env = 'prod') => {
  let config = [];
  if (type === 'webapp') {
    const appConfig = getAppConfig() || {};

    config = [
      require(`${webpackConfigMap.webapp.client}.${env}`)
    ];

    if (appConfig.ssr) {
      config.push(require(`${webpackConfigMap.webapp.server}.${env}`));

      if (appConfig.ssr.serverless) {
        config.push(require(`${webpackConfigMap.webapp.serverless}.${env}`));
      }
    }

    return config;
  }

  return require(`${webpackConfigMap[type]}.${env}`);
};