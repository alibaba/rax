const path = require('path');
const chalk = require('chalk');
const consoleClear = require('console-clear');
const { handleWebpackErr } = require('rax-compile-config');

const getMpOuput = require('./config/miniapp/getOutputPath');

module.exports = ({ chainWebpack, registerConfig, context, onHook }, options = {}) => {
  const { targets = [] } = options;

  let mpBuildErr = null;

  targets.forEach(target => {
    if (target === 'weex' || target === 'web') {
      const getBase = require(`./config/${target}/getBase`);
      const setBuild = require(`./config/${target}/setBuild`);

      registerConfig(target, getBase(context));

      chainWebpack((config) => {
        setBuild(config.getConfig(target), context);
      });
    }

    if (target === 'miniapp') {
      const mpBuild = require('./config/miniapp/build');
      onHook('after.build', async() => {
        const mpInfo = await mpBuild(context);
        if (mpInfo.err || mpInfo.stats.hasErrors()) {
          mpBuildErr = mpInfo;
        }
      });
    }
  });

  onHook('after.build', ({ err, stats }) => {
    const { rootDir, userConfig } = context;
    const { outputDir } = userConfig;

    consoleClear(true);

    if (mpBuildErr) {
      err = mpBuildErr.err;
      stats = mpBuildErr.stats;
    }

    if (!handleWebpackErr(err, stats)) {
      return;
    }

    console.log(chalk.green('Rax build finished:'));
    console.log();

    if (~targets.indexOf('web')) {
      console.log(chalk.green('[Web] Bundle at:'));
      console.log('   ', chalk.underline.white(path.resolve(rootDir, outputDir, 'web')));
      console.log();
    }

    if (~targets.indexOf('weex')) {
      console.log(chalk.green('[Weex] Bundle at:'));
      console.log('   ', chalk.underline.white(path.resolve(rootDir, outputDir, 'weex')));
      console.log();
    }

    if (~targets.indexOf('miniapp')) {
      console.log(chalk.green('[Miniapp] Bundle at:'));
      console.log('   ', chalk.underline.white(getMpOuput(context)));
      console.log();
    }
  });
};
