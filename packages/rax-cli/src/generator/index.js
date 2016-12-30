var path = require('path');
var chalk = require('chalk');
var spawn = require('cross-spawn');
var easyfile = require('easyfile');

function install(projectDir, projectName, verbose) {
  console.log(chalk.white.bold('Install dependencies:'));

  var proc = spawn('npm', [
    'install',
    verbose ? '--verbose' : ''
  ], {stdio: 'inherit'});

  proc.on('close', function(code) {
    if (code !== 0) {
      console.error('`npm install` failed');
      return;
    } else {
      console.log(chalk.white.bold('To run your app:'));
      console.log(chalk.white('   cd ' + projectName));
      console.log(chalk.white('   npm run start'));
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
