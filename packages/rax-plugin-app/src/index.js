const deepmerge = require('deepmerge');

const defaultUserConfig = require('./config/defaultUserConfig');
const build = require('./build');
const dev = require('./dev');

module.exports = (api, options) => {
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
