const getDevConfig = require('./config/getDevConfig');
const build = require('./config/build');

module.exports = ({ chainWebpack, registerConfig, rootDir, command }, options) => {
  if (command === 'dev') {
    registerConfig('component', getDevConfig(rootDir));
  }

  if (command === 'build') {
    build(rootDir);
  }
};
