const path = require('path');
const chalk = require('chalk');
const consoleClear = require('console-clear');

const getMpOuput = require('./config/miniapp/getOutputPath');

module.exports = ({ chainWebpack, registerConfig, context, onHook }, options = {}) => {
  const { targets = [] } = options;

  function devCompileLog({ url, err, stats }) {
    consoleClear(true);

    if (err) {
      console.error(err.stack || err);
      if (err.details) {
        console.error(err.details);
      }
      return;
    }
    if (stats.hasErrors()) {
      const errors = stats.compilation.errors;
      for (let e of errors) {
        console.log(chalk.red(`    ${errors.indexOf(e) + 1}. ${e.error.message} \n`));
        if (process.env.DEBUG === 'true') {
          console.log(e.error.stack);
        }
      }
      console.log(chalk.yellow('Set environment `DEBUG=true` to see detail error stacks.'));
      return;
    }

    console.log(chalk.green('Rax development server has been started:'));
    console.log();

    if (~targets.indexOf('web')) {
      console.log(chalk.green('[Web] Development server at:'));
      console.log('   ', chalk.underline.white(url));
      console.log();
    }

    if (~targets.indexOf('weex')) {
      console.log(chalk.green('[Weex] Development server at:'));
      console.log('   ', chalk.underline.white(`${url}/weex/index.js?wh_weex=true`));
      console.log();
    }

    if (~targets.indexOf('miniapp')) {
      console.log(chalk.green('[Miniapp] Watching file changes at:'));
      console.log('   ', chalk.underline.white(getMpOuput(context)));
      console.log();
    }
  }

  // run miniapp watch when targets has only miniapp
  if (targets.length === 1 && targets[0] === 'miniapp') {
    const mpDev = require('./config/miniapp/dev');
    onHook('after.dev', () => {
      mpDev(context, devCompileLog);
    });
  } else {
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

    onHook('after.devCompile', async({ url, err, stats }) => {
      // run miniapp build while targets have web or weex, for log control
      if (~targets.indexOf('miniapp')) {
        const mpBuild = require('./config/miniapp/build');
        let mpBuildErr = null;
        const mpInfo = await mpBuild(context);

        if (mpInfo.err || mpInfo.stats.hasErrors()) {
          mpBuildErr = mpInfo;
        }

        if (mpBuildErr) {
          err = mpBuildErr.err;
          stats = mpBuildErr.stats;
        }
      }

      devCompileLog({
        url,
        err,
        stats
      });
    });
  }
};

