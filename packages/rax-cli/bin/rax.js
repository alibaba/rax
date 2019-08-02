#!/usr/bin/env node

// Update notifications
const updateNotifier = require('update-notifier');
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

const path = require('path');
const init = require('../src/');
const argv = require('minimist')(process.argv.slice(2));

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
