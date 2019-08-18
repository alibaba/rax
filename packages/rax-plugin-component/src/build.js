'use strict';

const path = require('path');
const chalk = require('chalk');
const consoleClear = require('console-clear');

const { handleWebpackErr } = require('rax-compile-config');

const getDistConfig = require('./config/getDistConfig');
const buildLib = require('./buildLib');

module.exports = (api, options = {}) => {
  const { registerConfig, context, onHook } = api;
  const { targets = [] } = options;
  const { rootDir, userConfig } = context;
  const { distDir, outputDir } = userConfig;

  targets.forEach(target => {
    if (target === 'weex' || target === 'web') {
      const config = getDistConfig(context);
      registerConfig('component', config);
    }
  });

  onHook('after.build', async({ err, stats }) => {
    consoleClear(true);

    const libBuildErr = await buildLib(api, options);

    if (libBuildErr) {
      err = libBuildErr.err;
      stats = libBuildErr.stats;
    }

    if (!handleWebpackErr(err, stats)) {
      return;
    }

    console.log(chalk.green('Rax Component build finished:'));
    console.log();

    console.log(chalk.green('Component lib at:'));
    console.log('   ', chalk.underline.white(path.resolve(rootDir, outputDir)));
    console.log();

    console.log(chalk.green('Component dist at:'));
    console.log('   ', chalk.underline.white(path.resolve(rootDir, distDir)));
    console.log();
  });
};
