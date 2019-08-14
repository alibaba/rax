'use strict';

const hmrClient = require.resolve('../../hmr/webpackHotDevClient.entry');
const setUserConfig = require('../user/setConfig');

module.exports = (config, context) => {
  config.entry('index')
    .prepend(hmrClient);

  setUserConfig(config, context, 'weex');
};
