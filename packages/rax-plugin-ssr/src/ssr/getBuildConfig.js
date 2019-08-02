'use strict';
const getBaseWebpackConfig = require('./getBaseConfig');

module.exports = (rootDir) => {
  const config = getBaseWebpackConfig(rootDir);

  config.mode('production');

  config.optimization
    .minimize(true)
    .end();

  return config;
};
