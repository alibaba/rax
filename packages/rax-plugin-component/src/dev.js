const consoleClear = require('console-clear');
const qrcode = require('qrcode-terminal');
const chalk = require('chalk');
const { handleWebpackErr } = require('rax-compile-config');

const getMpOuput = require('./config/miniapp/getOutputPath');
const mpDev = require('./config/miniapp/dev');

module.exports = ({ registerConfig, context, onHook }, options = {}) => {
  const { targets = [] } = options;

  // set dev config
  targets.forEach(target => {
    if (target === 'weex' || target === 'web') {
      const getDevConfig = require(`./config/${target}/getDevConfig`);

      registerConfig('component', getDevConfig(context));
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
      console.log('   ', chalk.underline.white(getMpOuput(context)));
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
