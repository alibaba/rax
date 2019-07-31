'use strict';

module.exports = (config) => {
  config.mode('production');
  config.devtool('source-map');

  config.optimization
    .minimize(false);
};
