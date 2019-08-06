const { printLog } = require('./log');
const { spawnSync } = require('child_process');
const colors = require('colors');

/**
 * npm install
 * @param path {String} Absolute path to a text file.
 */
const invokeNpmInstall = function(path) {
  printLog(colors.green('Execute'), 'npm install --production');
  return spawnSync('npm', ['install', '--production'], {
    cwd: path,
    env: process.env,
    stdio: 'inherit'
  });
};

module.exports = {
  invokeNpmInstall
};
