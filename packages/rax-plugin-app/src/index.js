const chalk = require('chalk');
const deepmerge = require('deepmerge');
const defaultUserConfig = require('./config/defaultUserConfig');

const pluginApp = ({ chainWebpack, registerConfig, context, onHook }, options = {}) => {
  // set default config
  context.userConfig = deepmerge(context.userConfig, defaultUserConfig);

  const { targets = [] } = options;

  targets.forEach(target => {
    if (target === 'web' || target === 'weex') {
      const getBase = require(`./config/${target}/getBase`);
      const setDev = require(`./config/${target}/setDev`);
      const setBuild = require(`./config/${target}/setBuild`);

      registerConfig(target, getBase(context));

      chainWebpack((config, { command }) => {
        if (command === 'dev') {
          setDev(config.get(target), context);
        }

        if (command === 'build') {
          setBuild(config.get(target), context);
        }
      });

      if (target === 'weex') {
        onHook('after.dev', ({url}) => {
          console.log(chalk.green('[Weex] Starting the development server at:'));
          console.log('   ', chalk.underline.white(`${url}/weex/index.js?wh_weex=true`));
        });
      }
    }
  });
};

pluginApp.getWebBase = require('./config/web/getBase');
pluginApp.setWebDev = require('./config/web/setDev');
pluginApp.setWebBuild = require('./config/web/setBuild');

pluginApp.getWeexBase = require('./config/weex/getBase');
pluginApp.setWeexDev = require('./config/weex/setDev');
pluginApp.setWeexBuild = require('./config/weex/setBuild');

module.exports = pluginApp;