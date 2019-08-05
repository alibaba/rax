const deepmerge = require('deepmerge');

const defaultUserConfig = require('./config/defaultUserConfig');
const getDevConfig = require('./config/getDevConfig');
const build = require('./build');

module.exports = ({ chainWebpack, registerConfig, context }, options) => {
  context.userConfig = deepmerge(defaultUserConfig, context.userConfig);

  const { command } = context;
  if (command === 'dev') {
    registerConfig('component', getDevConfig(context));
  }

  if (command === 'build') {
    build(context);
  }
};
