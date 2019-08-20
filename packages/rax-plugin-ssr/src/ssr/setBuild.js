'use strict';

module.exports = (config) => {
  config.mode('production');

  config.optimization
    .minimize(true)
    .end();
};
