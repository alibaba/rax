const deepmerge = require('deepmerge');

const defaultUserConfig = require('./defaultUserConfig');
const build = require('./build');
const dev = require('./dev');

module.exports = ({ context, log }, options = {}) => {
  context.userConfig = deepmerge(defaultUserConfig, context.userConfig);

  const { command } = context;
  if (command === 'dev') {
    dev(context, options, log);
  }

  if (command === 'build') {
    build(context, options, log);
  }
};
