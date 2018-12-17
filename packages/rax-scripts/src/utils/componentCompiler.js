'use strict';

const fs = require('fs');
const path = require('path');
const spawnSync = require('child_process').spawnSync;

const babel = require('@babel/core');
const chalk = require('chalk');
const glob = require('glob');
const minimatch = require('minimatch');
const chokidar = require('chokidar');

const SRC_DIR = 'src';
const BUILD_DIR = 'lib';
const JS_FILES_PATTERN = '**/*.js';
const IGNORE_PATTERN = '**/__tests__/**';

const babelOptions = require('../config/babel.config');

babelOptions.babelrc = false;
// babelOptions.sourceMaps = 'inline';

const fixedWidth = str => {
  const WIDTH = 80;
  const strs = str.match(new RegExp(`(.{1,${WIDTH}})`, 'g'));
  let lastString = strs[strs.length - 1];
  if (lastString.length < WIDTH) {
    lastString += Array(WIDTH - lastString.length).join(chalk.dim('.'));
  }
  return strs.slice(0, -1).concat(lastString).join('\n');
};

function buildPackage(p) {
  const srcDir = path.resolve(p, SRC_DIR);
  const pattern = path.resolve(srcDir, '**/*');
  const files = glob.sync(pattern, {nodir: true});

  process.stdout.write(
    fixedWidth(`${path.basename(p)}\n`)
  );

  files.forEach(file => buildFile(p, file, true));
  process.stdout.write(`[  ${chalk.green('OK')}  ]\n`);
}

function getPackages() {
  return fs.readdirSync(process.cwd())
    .map(file => path.resolve(process.cwd(), file))
    .filter(f => fs.lstatSync(path.resolve(f)).isDirectory());
}

function buildFile(packagesDir, file, silent) {
  const packageName = path.relative(packagesDir, file).split(path.sep)[0];
  const packageSrcPath = path.resolve(packagesDir, SRC_DIR);
  const packageBuildPath = path.resolve(packagesDir, BUILD_DIR);
  const relativeToSrcPath = path.relative(packageSrcPath, file);
  const destPath = path.resolve(packageBuildPath, relativeToSrcPath);

  spawnSync('mkdir', ['-p', path.dirname(destPath)]);
  if (minimatch(file, IGNORE_PATTERN)) {
    silent || process.stdout.write(
      chalk.dim('  \u2022 ') +
      path.relative(packagesDir, file) +
      ' (ignore)\n'
    );
  } else if (!minimatch(file, JS_FILES_PATTERN)) {
    fs.createReadStream(file).pipe(fs.createWriteStream(destPath));
    silent || process.stdout.write(
      chalk.red('  \u2022 ') +
      path.relative(packagesDir, file) +
      chalk.red(' \u21D2 ') +
      path.relative(packagesDir, destPath) +
      ' (copy)' +
      '\n'
    );
  } else {
    const transformed = babel.transformFileSync(file, babelOptions).code;
    spawnSync('mkdir', ['-p', path.dirname(destPath)]);
    fs.writeFileSync(destPath, transformed);
    silent || process.stdout.write(
      chalk.green('  \u2022 ') +
      path.relative(packagesDir, file) +
      chalk.green(' \u21D2 ') +
      path.relative(packagesDir, destPath) +
      '\n'
    );
  }
}

module.exports = function compile(packagesName) {
  process.stdout.write(chalk.bold.inverse('Compiling packages\n'));
  buildPackage(process.cwd());
  process.stdout.write('\n');
};
