const { existsSync } = require('fs');
const { resolve} = require('path');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpackBaseConfig');
const getEntry = require('./getEntry');
const getMiniappType = require('../config/getMiniappType');
const webpackApiConfig = require('./getInjectAPIConfig');

// devtool: 'eval-source-map',
module.exports = function getWebpackConfig(projectDir, isDevServer) {
  const miniappType = getMiniappType(projectDir);
  const mergeConfig = {
    entry: getEntry(projectDir),
    mode: process.env.NODE_ENV || 'development',
    context: projectDir,
  };

  const config = [];

  if (miniappType === 'sfc') {
    config.push(merge(
      webpackBaseConfig,
      require('./getSFCConfig')(projectDir, {
        isDevServer,
      }),
      mergeConfig,
    ));
  } else if (miniappType === 'mp') {
    config.push(merge(
      webpackBaseConfig,
      require('./getMiniProgramConfig')(projectDir, {
        isDevServer,
      }),
      mergeConfig,
    ));
  } else {
    throw new Error('Cannot recognize MiniApp Type!');
  }

  const injectApiPath = resolve(projectDir, 'api.js');
  if (existsSync(injectApiPath)) {
    config.push(merge(
      webpackBaseConfig,
      webpackApiConfig(projectDir)
    ));
  }

  return config;
};
