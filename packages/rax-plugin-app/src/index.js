
/**
 * options {
 *    targets: ['web']
 * }
 */
module.exports = ({ chainWebpack, registerConfig }, options = {}) => {
  const { targets = [] } = options;

  targets.forEach(target => {
      const getBase = require(`./${target}/getBase`);
      const setDev = require(`./${target}/setDev`);
      const setBuild = require(`./${target}/setBuild`);
      
      registerConfig(target, getBase());
  
      chainWebpack((config, { command }) => {
        if (command === 'dev') {
          setDev(config.get(target))
        }

        if (command === 'build') {
          setBuild(config.get(target))
        }
      });
    }
  })
}
