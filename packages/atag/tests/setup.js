/* eslint-disable import/no-extraneous-dependencies */
const chalk = require('chalk');
const puppeteer = require('puppeteer');
const fs = require('fs');
const kill = require('kill-port');
const mkdirp = require('mkdirp');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');
const DEV_PORT = 9002;

kill(DEV_PORT);

module.exports = async function() {
  console.log(chalk.green('Setup WebpackDevServer at ' + DEV_PORT));
  if (!global.__WEBPACK_DEV_SERVER__) {
    global.__WEBPACK_DEV_SERVER__ = await startDevServer(DEV_PORT);
  }

  console.log(chalk.green('Setup Puppeteer'));
  const browser = await puppeteer.launch({});
  // This global is not available inside tests but only in global teardown
  global.__BROWSER_GLOBAL__ = browser;
  // Instead, we expose the connection details via file system to be used in tests
  mkdirp.sync(DIR);
  fs.writeFileSync(path.join(DIR, 'wsEndpoint'), browser.wsEndpoint());
};

function startDevServer(port) {
  port = port || 9002;

  return new Promise(resolve => {
    const handle = spawn(require.resolve('rollup/bin/rollup'), [
      '-c',
      require.resolve('../config/rollup.config.dev.js'),
    ], {
      env: Object.assign({}, process.env, {
        NODE_ENV: 'development',
        PORT: port
      }),
      // stdio: 'inherit',
    });
    handle.stdout.on('data', (data) => {
      const str = data.toString();
      if (str.indexOf('Compiled successfully.') !== -1) {
        resolve(handle);
      }
    });
  });
}
