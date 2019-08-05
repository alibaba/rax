const deepmerge = require('deepmerge');

const defaultUserConfig = require('./defaultUserConfig');
const build = require('./build');
const dev = require('./dev');

module.exports = ({ context }, options = {}) => {
  context.userConfig = deepmerge(defaultUserConfig, context.userConfig);

  const { command } = context;
  if (command === 'dev') {
    dev(context);
  }

  if (command === 'build') {
    build(context);
  }
};
