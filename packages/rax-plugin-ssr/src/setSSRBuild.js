'use strict';

module.exports = (config) => {
  config.optimization
    .clear()
    .minimize(false);
};
