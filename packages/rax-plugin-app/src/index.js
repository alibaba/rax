const webBase = require('./web/webBase');
const webDev = require('./web/webDev');
const webBuild = require('./web/webBuild');

/**
 * options {
 *    targets: ['web']
 * }
 */

module.exports = ({ chainWebpack, registerConfig }, options = {}) => {
  const { targets = [] } = options;

  targets.forEach(target => {
    if (target === 'web') {
      registerConfig('web', webBase());
  
      chainWebpack((config, { command }) => {
        if (command === 'dev') {
          webDev(config.get('web'))
        }

        if (command === 'build') {
          webBuild(config.get('web'))
        }
      });
    }
  })
}
