const deepmerge = require('deepmerge');

const defaultUserConfig = require('./config/defaultUserConfig');
const buildLib = require('./buildLib.js');
const buildDist = require('./buildDist.js');
const dev = require('./dev');

module.exports = (api, options = {}) => {
  api.context.userConfig = deepmerge(defaultUserConfig, api.context.userConfig);
  const { command } = api.context;

  // set dev config
  if (command === 'dev') {
    dev(api, options);
  }

  if (command === 'build') {
    buildLib(api, options);
    buildDist(api, options);
  }
};
