const consoleClear = require('console-clear');
const qrcode = require('qrcode-terminal');
const chalk = require('chalk');
const path = require('path');
const { handleWebpackErr } = require('rax-compile-config');

const watchLib = require('./watchLib');
const mpDev = require('./config/miniapp/dev');

module.exports = (api, options = {}) => {
  const { registerConfig, context, onHook } = api;
  const { rootDir, userConfig } = context;
  const { devWatchLib } = userConfig;
  const { targets = [] } = options;

  // set dev config
  targets.forEach(target => {
    if (target === 'weex' || target === 'web') {
      const getDev = require(`./config/${target}/getDev`);
      const config = getDev(context);
      registerConfig('component', config);
    }
  });

  let devUrl = '';
  let devCompletedArr = [];

  function devCompileLog() {
    consoleClear(true);
    let { err, stats } = devCompletedArr[0];

    devCompletedArr.forEach((devInfo) => {
      if (devInfo.err || devInfo.stats.hasErrors()) {
        err = devInfo.err;
        stats = devInfo.stats;
      }
    });

    devCompletedArr = [];

    if (!handleWebpackErr(err, stats)) {
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
      const weexUrl = `${devUrl}/weex/index.js?wh_weex=true`;
      console.log(chalk.green('[Weex] Development server at:'));
      console.log('   ', chalk.underline.white(weexUrl));
      console.log();
      qrcode.generate(weexUrl, {small: true});
      console.log();
    }

    if (~targets.indexOf('miniapp')) {
      console.log(chalk.green('[Miniapp] Use miniapp developer tools to open the following folder:'));
      console.log('   ', chalk.underline.white(path.resolve(rootDir, 'demo/miniapp')));
      console.log();
    }
  }

  if (~targets.indexOf('miniapp')) {
    if (targets.length > 1) {
      onHook('after.dev', () => {
        mpDev(context, (args) => {
          devCompletedArr.push(args);
          if (devCompletedArr.length === 2) {
            devCompileLog();
          }
        });
      });
    } else {
      mpDev(context, (args) => {
        devCompletedArr.push(args);
        devCompileLog();
      });
    }
  }

  if (devWatchLib) {
    onHook('after.dev', () => {
      watchLib(api, options);
    });
  }

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
