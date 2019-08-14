#!/usr/bin/env node

// Update notifications
const updateNotifier = require('update-notifier');
const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;
const spawn = require('cross-spawn');
const inquirer = require('inquirer');
const argv = require('minimist')(process.argv.slice(2));

const cli = require('../src/');
const pkg = require('../package.json');

updateNotifier({pkg: pkg}).notify();

// Check node version
const chalk = require('chalk');
const semver = require('semver');

if (!semver.satisfies(process.version, '>=8')) {
  const message = 'You are currently running Node.js ' +
    chalk.red(process.version) + '.\n' +
    '\n' +
    'Rax runs on Node 6.0 or newer. There are several ways to ' +
    'upgrade Node.js depending on your preference.\n' +
    '\n' +
    'nvm:       nvm install node && nvm alias default node\n' +
    'Homebrew:  brew install node\n' +
    'Installer: download the Mac .pkg from https://nodejs.org/\n';

  console.log(message);
  process.exit(1);
}

const RAX_PACKAGE_JSON_PATH = path.resolve(
  process.cwd(),
  'node_modules',
  'rax',
  'package.json'
);

checkForVersionArgument();

// minimist api
const commands = argv._;

if (commands.length === 0) {
  console.error(
    'You did not pass any commands, did you mean to run `rax init`?'
  );
  process.exit(1);
}

switch (commands[0]) {
  case 'init':
    if (!commands[1]) {
      console.error(
        'Usage: rax init <ProjectName> [--verbose]'
      );
      process.exit(1);
    } else {
      init(commands[1], argv.verbose, argv.version);
    }
    break;
  default:
    console.error(
      'Command `%s` unrecognized.',
      commands[0]
    );
    process.exit(1);
    break;
}

function init(name, verbose) {
  Promise.resolve(fs.existsSync(name))
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
}

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
          value: 'scaffold'
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
      default: 'scaffold'
    },
    {
      type: 'checkbox',
      name: 'projectTargets',
      when: function(answers) {
        return answers.projectType === 'scaffold';
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
        return answers.projectType === 'scaffold' && answers.projectTargets.includes('web');
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
  const projectName = name;
  const autoInstallModules = userAnswers.autoInstallModules;

  console.log(
    'Creating a new Rax project in',
    root
  );

  if (!fs.existsSync(root)) {
    fs.mkdirSync(root);
  }
  process.chdir(root);

  cli.init({
    root: root,
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

function checkForVersionArgument() {
  if (argv._.length === 0 && (argv.v || argv.version)) {
    console.log('rax-cli: ' + require('../package.json').version);
    try {
      console.log('rax: ' + require(RAX_PACKAGE_JSON_PATH).version);
    } catch (e) {
      console.log('rax: n/a - not inside a Rax project directory');
    }
    process.exit();
  }
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
