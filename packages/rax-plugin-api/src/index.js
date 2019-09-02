const deepmerge = require('deepmerge');
const plugin = require('rax-plugin-component');

const defaultUserConfig = require('./defaultUserConfig');

module.exports = (api, options = {}) => {
  api.context.userConfig = deepmerge(defaultUserConfig, api.context.userConfig);

  const { command } = api.context;
  options = {
    ...options,
    targets: ['web', 'weex']
  };

  if (command === 'dev') {
    plugin(api, options);
  }

  if (command === 'build') {
    plugin(api, options);
  }
};
