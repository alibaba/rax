const pluginApp = ({ chainWebpack, registerConfig, rootDir }, options = {}) => {
  const { targets = [] } = options;

  targets.forEach(target => {
    const getBase = require(`./config/${target}/getBase`);
    const setDev = require(`./config/${target}/setDev`);
    const setBuild = require(`./config/${target}/setBuild`);

    registerConfig(target, getBase(rootDir));

    chainWebpack((config, { command }) => {
      if (command === 'dev') {
        setDev(config.get(target), rootDir);
      }

      if (command === 'build') {
        setBuild(config.get(target), rootDir);
      }
    });
  });
};

pluginApp.getWebBase = require('./config/web/getBase');
pluginApp.setWebDev = require('./config/web/setDev');
pluginApp.setWebBuild = require('./config/web/setBuild');

module.exports = pluginApp;
