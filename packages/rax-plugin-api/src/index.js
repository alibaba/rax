const chalk = require('chalk');
const path = require('path');
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

    api.onHook('after.devCompile', () => {
      console.log(chalk.green('[Miniapp] Use miniapp developer tools to open the following folder:'));
      console.log('   ', chalk.underline.white(path.resolve(api.context.rootDir, 'demo/miniapp')));
      console.log();
    });
  }

  if (command === 'build') {
    plugin(api, options);
  }
};
