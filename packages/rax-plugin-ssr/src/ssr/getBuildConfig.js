'use strict';
const getBaseWebpackConfig = require('./getBaseConfig');

module.exports = (context) => {
  const config = getBaseWebpackConfig(context);

  config.mode('production');

  config.optimization
    .minimize(true)
    .end();

  return config;
};
