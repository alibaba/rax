const deepmerge = require('deepmerge');

const defaultUserConfig = require('./config/defaultUserConfig');
const build = require('./build');
const dev = require('./dev');

const pluginApp = (api, options) => {
  const { context } = api;
  const { command } = context;
  // set default config
  context.userConfig = deepmerge(defaultUserConfig, context.userConfig);

  if (command === 'build') {
    build(api, options);
  }

  if (command === 'dev') {
    dev(api, options);
  }
};

pluginApp.getWebBase = require('./config/web/getBase');
pluginApp.setWebDev = require('./config/web/setDev');
pluginApp.setWebBuild = require('./config/web/setBuild');

pluginApp.getWeexBase = require('./config/weex/getBase');
pluginApp.setWeexDev = require('./config/weex/setDev');
pluginApp.setWeexBuild = require('./config/weex/setBuild');

module.exports = pluginApp;
