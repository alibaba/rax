#!/usr/bin/env node

// Update notifications
var updateNotifier = require('update-notifier');
var pkg = require('../package.json');
updateNotifier({pkg: pkg}).notify();

// Check node version
var chalk = require('chalk');
var semver = require('semver');
if (!semver.satisfies(process.version, '>=4')) {
  var message = 'You are currently running Node.js ' +
    chalk.red(process.version) + '.\n' +
    '\n' +
    'Rax runs on Node 4.0 or newer. There are several ways to ' +
    'upgrade Node.js depending on your preference.\n' +
    '\n' +
    'nvm:       nvm install node && nvm alias default node\n' +
    'Homebrew:  brew install node\n' +
    'Installer: download the Mac .pkg from https://nodejs.org/\n';

  console.log(message);
  process.exit(1);
}

var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
var spawn = require('cross-spawn');
var prompt = require('prompt');
var cli = require('../lib/');
var argv = require('minimist')(process.argv.slice(2));

var RAX_PACKAGE_JSON_PATH = path.resolve(
  process.cwd(),
  'node_modules',
  'rax',
  'package.json'
);

checkForVersionArgument();

// minimist api
var commands = argv._;

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

function init(name, verbose, rwPackage) {
  if (fs.existsSync(name)) {
    createAfterConfirmation(name, verbose, rwPackage);
  } else {
    createProject(name, verbose, rwPackage);
  }
}

function createAfterConfirmation(name, verbose, rwPackage) {
  prompt.start();

  var property = {
    name: 'yesno',
    message: 'Directory ' + name + ' already exists. Continue?',
    validator: /y[es]*|n[o]?/,
    warning: 'Must respond yes or no',
    default: 'no'
  };

  prompt.get(property, function(err, result) {
    if (result.yesno[0] === 'y') {
      createProject(name, verbose, rwPackage);
    } else {
      console.log('Project initialization canceled');
      process.exit();
    }
  });
}

function createProject(name, verbose, rwPackage) {
  var root = path.resolve(name);
  var projectName = path.basename(root);

  console.log(
    'Creating a new Rax project in',
    root
  );

  if (!fs.existsSync(root)) {
    fs.mkdirSync(root);
  }
  process.chdir(root);

  cli.init(root, projectName, verbose);
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
