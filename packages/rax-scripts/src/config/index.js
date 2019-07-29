const fs = require('fs');
const path = require('path');
const pathConfig = require('./path.config');
const appConfig = require('./app.config');
const rewireWebpackConfig = require('../utils/rewireWebpackConfig');

const webpackConfigMap = {
  webapp: {
    client: './webapp/client/webpack.config',
    server: './webapp/server/webpack.config',
    serverless: './webapp/serverless/webpack.config'
  },
  weexapp: './weexapp/webpack.config',
  component: './component/webpack.config',
  universalapp: './universalapp/webpack.config',
};

exports.getWebpackConfig = (type, env = 'prod') => {
  let config;
  if (type === 'webapp') {
    config = [
      require(`${webpackConfigMap.webapp.client}.${env}`)
    ];

    if (appConfig.ssr) {
      config.push(require(`${webpackConfigMap.webapp.server}.${env}`));

      if (appConfig.ssr.serverless) {
        config.push(require(`${webpackConfigMap.webapp.serverless}.${env}`));
      }
    }
  } else {
    config = require(`${webpackConfigMap[type]}.${env}`);
  }

  return rewireWebpackConfig(config);
};

exports.getEntries = () => {
  const appDirectory = pathConfig.appDirectory;
  const appSrc = pathConfig.appSrc;

  const entries = {};

  const files = fs.readdirSync(path.join(appSrc, 'pages'));
  files.map((file) => {
    const absolutePath = path.join(appSrc, 'pages', file);
    const pathStat = fs.statSync(absolutePath);

    if (pathStat.isDirectory()) {
      const relativePath = path.relative(appDirectory, absolutePath);
      entries[file] = './' + path.join(relativePath, '/');
    }
  });

  const documentPath = pathConfig.appDocument;
  if (fs.existsSync(documentPath)) {
    entries._document = documentPath;
  }

  const shellPath = pathConfig.appShell;
  if (fs.existsSync(shellPath)) {
    entries._shell = shellPath;
  }

  return entries;
};
