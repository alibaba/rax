const inquirer = require('inquirer');
const path = require('path');
const execSync = require('child_process').execSync;
const spawn = require('cross-spawn');
const chalk = require('chalk');
const fs = require('fs');

const generate = require('./generator');

function createAfterConfirmation(name) {
  const property = {
    type: 'confirm',
    name: 'continueWhileDirectoryExists',
    message: 'Directory ' + name + ' already exists. Continue?',
    default: false
  };

  return inquirer.prompt(property).then(function(answers) {
    if (answers && answers.continueWhileDirectoryExists) {
      return true;
    } else {
      console.log('Project initialization canceled.');
      process.exit(1);
    }
  });
}

function askProjectInformaction(name) {
  const questions = [
    {
      type: 'list',
      name: 'projectType',
      message: 'What\'s your project type?',
      choices: [
        {
          name: 'App (Build application that works multi-platform)',
          value: 'app'
        },
        {
          name: 'Component (Build component for application include web)',
          value: 'component'
        },
        {
          name: 'API (Build universal API library)',
          value: 'api'
        }
      ],
      default: 'app'
    },
    {
      type: 'checkbox',
      name: 'projectTargets',
      when: function(answers) {
        return answers.projectType === 'app';
      },
      validate: function(targets) {
        if (targets && targets.length > 0) return true;
        return 'Choose at least one of target.';
      },
      message: 'Do you want to build to these targets?',
      choices: [
        {
          name: 'web',
          value: 'web'
        },
        {
          name: 'weex',
          value: 'weex'
        },
        {
          name: 'miniapp',
          value: 'miniapp'
        }
      ],
      default: false
    },
    {
      type: 'checkbox',
      name: 'projectFeatures',
      when: function(answers) {
        return answers.projectType === 'app' && answers.projectTargets.includes('web');
      },
      message: 'Do you want to enable these features?',
      choices: [
        {
          name: 'server sider rendering (ssr)',
          value: 'ssr'
        }
      ],
      default: false
    },
    {
      type: 'input',
      name: 'projectAuthor',
      message: 'What\'s author\'s name?',
      default: 'rax'
    },
    {
      type: 'confirm',
      name: 'autoInstallModules',
      message: 'Do you want to install dependences automatically after initialization?',
      default: 'y'
    }
  ];
  return inquirer.prompt(questions);
}

function createProject(name, verbose, userAnswers) {
  const pkgManager = shouldUseYarn() ? 'yarn' : 'npm';
  const root = path.resolve(name);
  const projectName = userAnswers.projectName;
  const autoInstallModules = userAnswers.autoInstallModules;

  console.log(
    'Creating a new Rax project in',
    root
  );

  if (!fs.existsSync(root)) {
    fs.mkdirSync(root);
  }
  process.chdir(root);

  generate({
    root: root,
    directoryName: name,
    projectName: projectName,
    projectType: userAnswers.projectType,
    projectFeatures: userAnswers.projectFeatures || [],
    projectAuthor: userAnswers.projectAuthor || '',
    projectTargets: userAnswers.projectTargets || [],
    verbose: verbose,
  }).then(function(directory) {
    if (autoInstallModules) {
      return install(directory, verbose);
    } else {
      return false;
    }
  }).then(function(isAutoInstalled) {
    console.log(chalk.white.bold('To run your app:'));
    console.log(chalk.white('   cd ' + projectName));
    if (!isAutoInstalled) {
      console.log(chalk.white('   ' + (pkgManager === 'npm' ? 'npm install' : 'yarn')));
    }
    console.log(chalk.white('   ' + pkgManager + ' start'));
  });
}

function shouldUseYarn() {
  try {
    execSync('yarn --version', {stdio: 'ignore'});
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * run npm/yarn install
 * @param directory - the cwd directory
 * @param verbose - enable verbose mode
 * @returns {Promise}
 */
function install(directory, verbose) {
  console.log(chalk.white.bold('Install dependencies:'));

  const pkgManager = shouldUseYarn() ? 'yarn' : 'npm';
  const args = ['install'];
  if (verbose) {
    args.push('--verbose');
  }

  return new Promise(function(resolve) {
    const proc = spawn(pkgManager, args, {stdio: 'inherit', cwd: directory});

    proc.on('close', function(code) {
      if (code !== 0) {
        console.error('`' + pkgManager + ' install` failed');
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

/**
 * The entry of init.
 * @param  {String} name - The name of project
 * @param  {Boolean} verbose - argv.verbose
 * @return {Promise}
 */
module.exports = function init(name, verbose) {
  return Promise.resolve(fs.existsSync(name))
    .then(function(dirExists) {
      if (dirExists) {
        return createAfterConfirmation(name, verbose);
      } else {
        return;
      }
    })
    .then(function() {
      return askProjectInformaction(name, verbose);
    })
    .then(function(answers) {
      return createProject(name, verbose, answers);
    })
    .catch(function(err) {
      console.error('Error occured', err.stack);
      process.exit(1);
    });
};
