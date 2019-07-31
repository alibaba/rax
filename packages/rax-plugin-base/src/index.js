const webBase = require('./web/webBase');
const webDev = require('./web/webDev');
const webBuild = require('./web/webBuild');

module.exports = ({ chainWebpack, registerConfig }, options) => {
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
