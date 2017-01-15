var path = require('path');
var chalk = require('chalk');
var spawn = require('cross-spawn');
var easyfile = require('easyfile');
var execSync = require('child_process').execSync;

function shouldUseYarn() {
  try {
    execSync('yarnpkg --version', {stdio: 'ignore'});
    return true;
  } catch (e) {
    return false;
  }
}

function install(projectDir, projectName, verbose) {
  console.log(chalk.white.bold('Install dependencies:'));

  var pkgManager = shouldUseYarn() ? 'yarnpkg' : 'npm';
  var args = ['install'];
  if (verbose) {
    args.push('--verbose');
  }
  var proc = spawn(pkgManager, args, {stdio: 'inherit'});

  proc.on('close', function(code) {
    if (code !== 0) {
      console.error('`' + pkgManager + ' install` failed');
      return;
    } else {
      console.log(chalk.white.bold('To run your app:'));
      console.log(chalk.white('   cd ' + projectName));
      console.log(chalk.white('   ' + pkgManager + ' run start'));
    }
  });
}

module.exports = function(projectDir, projectName, verbose) {
  var src = path.join(__dirname, 'templates');

  easyfile.copy(src, projectDir, {
    force: true,
    backup: true,
  });

  process.chdir(projectDir);
  install(projectDir, projectName, verbose);
};
