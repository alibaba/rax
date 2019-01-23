/* eslint-disable import/no-extraneous-dependencies */
const chalk = require('chalk');
const rimraf = require('rimraf');
const os = require('os');
const path = require('path');

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');
const isJestWatchMode = !'JEST_WORKER_ID' in process.env;

module.exports = async function() {
  // In watch mode, do not kill webpack dev server each time.
  if (!isJestWatchMode && global.__WEBPACK_DEV_SERVER__) {
    console.log(chalk.green('Teardown WebpackDevServer'));
    global.__WEBPACK_DEV_SERVER__.kill();
  }

  console.log(chalk.green('Teardown Puppeteer'));
  await global.__BROWSER_GLOBAL__.close();
  rimraf.sync(DIR);
};

