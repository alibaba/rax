var path = require('path');
var chalk = require('chalk');
var fs = require('fs');
var spawn = require('cross-spawn');
var easyfile = require('easyfile');
var cp = require('child_process');
var execSync = cp.execSync;

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

module.exports = function(kwargs) {
  var projectDir = kwargs.root;
  var projectName = kwargs.projectName;
  var directoryName = kwargs.directoryName;
  var projectAuthor = kwargs.projectAuthor;
  var verbose = kwargs.verbose;

  var src = path.join(__dirname, 'templates');
  var pkgPath = path.join(projectDir, 'package.json');
  easyfile.copy(src, projectDir, {
    force: true,
    backup: true,
  });

  var replacedPkg = fs.readFileSync(pkgPath, 'utf-8')
    .replace('__YourProjectName__', projectName)
    .replace('__AuthorName__', projectAuthor);
  fs.writeFileSync(pkgPath, replacedPkg);

  process.chdir(projectDir);
  install(projectDir, projectName, verbose);
};
