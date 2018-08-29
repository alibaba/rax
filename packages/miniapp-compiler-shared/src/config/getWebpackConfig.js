const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpackBaseConfig');
const getEntry = require('./getEntry');
const getMiniappType = require('../helpers/getMiniappType');

// devtool: 'eval-source-map',
module.exports = function getWebpackConfig(projectDir, isDevServer) {
  const miniappType = getMiniappType(projectDir);
  const mergeConfig = {
    entry: getEntry(projectDir),
    mode: process.env.NODE_ENV || 'development'
  };

  if (miniappType === 'sfc') {
    return merge(
      webpackBaseConfig,
      require('./dsl/sfc')(projectDir, {
        isDevServer,
      }),
      mergeConfig
    );
  } else if (miniappType === 'mp') {
    return merge(
      webpackBaseConfig,
      require('./dsl/mp')(projectDir, {
        isDevServer,
      }),
      mergeConfig
    );
  } else {
    throw new Error('Cannot recognize MiniApp Type!');
  }
};