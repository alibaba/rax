const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpackBaseConfig');
const getEntry = require('./getEntry');
const { getAppConfig } = require('./getAppConfig');
const getMiniappType = require('../config/getMiniappType');

// devtool: 'eval-source-map',
module.exports = function getWebpackConfig(projectDir, isDevServer) {
  const appConfig = getAppConfig(projectDir);
  const miniappType = getMiniappType(projectDir);
  const mergeConfig = {
    entry: getEntry(projectDir),
    mode: process.env.NODE_ENV || 'development',
    context: projectDir,
  };

  if (miniappType === 'sfc') {
    return merge(
      webpackBaseConfig,
      require('./getSFCConfig')(projectDir, {
        isDevServer,
        appConfig,
      }),
      mergeConfig,
    );
  } else if (miniappType === 'mp') {
    return merge(
      webpackBaseConfig,
      require('./getMiniProgramConfig')(projectDir, {
        isDevServer,
        appConfig,
      }),
      mergeConfig,
    );
  } else {
    throw new Error('Cannot recognize MiniApp Type!');
  }
};
