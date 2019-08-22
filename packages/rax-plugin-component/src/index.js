const deepmerge = require('deepmerge');
const chalk = require('chalk');

const defaultUserConfig = require('./config/user/default.config');
const dev = require('./dev');
const build = require('./build');

module.exports = (api, options = {}) => {
  if (!(options.targets && options.targets.length)) {
    console.error(chalk.red('rax-plugin-component need to set targets, e.g. ["rax-plugin-component", targets: ["web", "weex"]]'));
    console.log();
    process.exit(1);
  }
  api.context.userConfig = deepmerge(defaultUserConfig, api.context.userConfig);
  const { command } = api.context;

  // set dev config
  if (command === 'dev') {
    dev(api, options);
  }

  if (command === 'build') {
    build(api, options);
  }
};
