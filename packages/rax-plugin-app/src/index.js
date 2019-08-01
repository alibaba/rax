const pluginApp = ({ chainweexpack, registerConfig, rootDir }, options = {}) => {
  const { targets = [] } = options;

  targets.forEach(target => {
    if (target === 'weex' || target === 'weex') {
      const getBase = require(`./config/${target}/getBase`);
      const setDev = require(`./config/${target}/setDev`);
      const setBuild = require(`./config/${target}/setBuild`);

      registerConfig(target, getBase(rootDir));

      chainweexpack((config, { command }) => {
        if (command === 'dev') {
          setDev(config.get(target), rootDir);
        }

        if (command === 'build') {
          setBuild(config.get(target), rootDir);
        }
      });
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
