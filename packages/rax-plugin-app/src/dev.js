const path = require('path');
const chalk = require('chalk');
const consoleClear = require('console-clear');

const getMpOuput = require('./config/miniapp/getOutputPath');
const mpDev = require('./config/miniapp/dev');

module.exports = ({ chainWebpack, registerConfig, context, onHook }, options = {}) => {
  const { targets = [] } = options;

  let devUrl = '';
  let devCompletedArr = [];

  function devCompileLog() {
    consoleClear(true);
    let err = devCompletedArr[0].err;
    let stats = devCompletedArr[0].stats;

    devCompletedArr.forEach((devInfo) => {
      if (devInfo.err || devInfo.stats.hasErrors()) {
        err = devInfo.err;
        stats = devInfo.stats;
      }
    })

    devCompletedArr = [];

    if (err) {
      console.error(err.stack || err);
      if (err.details) {
        console.error(err.details);
      }
      return;
    }

    if (stats.hasErrors()) {
      let errArr = [];
      try {
        errArr = stats.stats.map(v => v.compilation.errors);
      } catch (e) {
        errArr = [stats.compilation.errors];
      }

      for (let errors of errArr) {
        for (let e of errors) {
          console.log(chalk.red(`    ${errors.indexOf(e) + 1}. ${e.error.message} \n`));
          if (process.env.DEBUG === 'true') {
            console.log(e.error.stack);
          }
        }
      }

      console.log(chalk.yellow('Set environment `DEBUG=true` to see detail error stacks.'));
      return;
    }

    console.log(chalk.green('Rax development server has been started:'));
    console.log();

    if (~targets.indexOf('web')) {
      console.log(chalk.green('[Web] Development server at:'));
      console.log('   ', chalk.underline.white(devUrl));
      console.log();
    }

    if (~targets.indexOf('weex')) {
      console.log(chalk.green('[Weex] Development server at:'));
      console.log('   ', chalk.underline.white(`${devUrl}/weex/index.js?wh_weex=true`));
      console.log();
    }

    if (~targets.indexOf('miniapp')) {
      console.log(chalk.green('[Miniapp] Use miniapp developer tools to open the following folder:'));
      console.log('   ', chalk.underline.white(getMpOuput(context)));
      console.log();
    }
  }

  if (~targets.indexOf('miniapp')) {
    onHook('after.dev', () => {
      mpDev(context, (args) => {
        devCompletedArr.push(args);
        if (devCompletedArr.length === 2) {
          devCompileLog();
        }
      });
    });
  }

  targets.forEach(target => {
    if (target === 'weex' || target === 'web') {
      const getBase = require(`./config/${target}/getBase`);
      const setDev = require(`./config/${target}/setDev`);

      registerConfig(target, getBase(context));

      chainWebpack((config) => {
        setDev(config.getConfig(target), context);
      });
    }
  });

  onHook('after.devCompile', async(args) => {
    devUrl = args.url;
    devCompletedArr.push(args);
    // run miniapp build while targets have web or weex, for log control
    if (~targets.indexOf('miniapp')) {
      if (devCompletedArr.length === 2) {
        devCompileLog();
      }
    } else {
      devCompileLog();
    }
  });
};
