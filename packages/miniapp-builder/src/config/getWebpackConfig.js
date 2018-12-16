const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpackBaseConfig');
const getEntry = require('./getEntry');
const getMiniappType = require('../config/getMiniappType');

// devtool: 'eval-source-map',
module.exports = function getWebpackConfig(projectDir, isDevServer) {
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
      }),
      mergeConfig,
    );
  } else if (miniappType === 'mp') {
    return merge(
      webpackBaseConfig,
      require('./getMiniProgramConfig')(projectDir, {
        isDevServer,
      }),
      mergeConfig,
    );
  } else {
    throw new Error('Cannot recognize MiniApp Type!');
  }
};
