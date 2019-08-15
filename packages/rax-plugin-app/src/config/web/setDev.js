'use strict';

const setUserConfig = require('../user/setConfig');

module.exports = (config, context) => {
  setUserConfig(config, context, 'web');
};
