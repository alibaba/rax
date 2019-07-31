module.exports = ({ chainWebpack, registerConfig }, options = {}) => {
  const { targets = [] } = options;

  targets.forEach(target => {
    const getBase = require(`./config/${target}/getBase`);
    const setDev = require(`./config/${target}/setDev`);
    const setBuild = require(`./config/${target}/setBuild`);
    
    registerConfig(target, getBase());

    chainWebpack((config, { command }) => {
      if (command === 'dev') {
        setDev(config.get(target))
      }

      if (command === 'build') {
        setBuild(config.get(target))
      }
    });
  });
}
