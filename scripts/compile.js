/**
 * script to build (transpile) files.
 * By default it transpiles all files for all packages and writes them
 * into `lib/` directory.
 * Non-js or files matching IGNORE_PATTERN will be copied without transpiling.
 *
 * Example:
 *  compile all packages: node ./scripts/compile.js
 *  watch compile some packages: node ./scripts/compile.js --watch --packages rax,rax-cli
 */
'use strict';

const fs = require('fs');
const path = require('path');
const spawnSync = require('child_process').spawnSync;

const babel = require('@babel/core');
const chalk = require('chalk');
const glob = require('glob');
const minimatch = require('minimatch');
const parseArgs = require('minimist');
const chokidar = require('chokidar');

const SRC_DIR = 'src';
const JS_FILES_PATTERN = '**/*.js';
const IGNORE_PATTERN = '**/{__tests__,__mocks__}/**';

const args = parseArgs(process.argv);
const customPackages = args.packages;

const getBabelConfig = require('./config/getBabelConfig');

const fixedWidth = str => {
  const WIDTH = 80;
  const strs = str.match(new RegExp(`(.{1,${WIDTH}})`, 'g'));
  let lastString = strs[strs.length - 1];
  if (lastString.length < WIDTH) {
    lastString += Array(WIDTH - lastString.length).join(chalk.dim('.'));
  }
  return strs.slice(0, -1).concat(lastString).join('\n');
};

function buildPackage(packagesDir, p, isBuildEs) {
  const srcDir = path.resolve(p, SRC_DIR);
  const pattern = path.resolve(srcDir, '**/*');
  const files = glob.sync(pattern, {nodir: true});

  process.stdout.write(
    fixedWidth(`${path.basename(p)}\n`)
  );

  files.forEach(file => buildFile(packagesDir, file, isBuildEs));
  process.stdout.write(`[  ${chalk.green('OK')}  ]\n`);
}

function getPackages(packagesDir, customPackages) {
  return fs.readdirSync(packagesDir)
    .map(file => path.resolve(packagesDir, file))
    .filter(f => {
      if (customPackages) {
        const packageName = path.relative(packagesDir, f).split(path.sep)[0];
        return packageName.indexOf(customPackages) !== -1;
      } else {
        return true;
      }
    })
    .filter(f => fs.lstatSync(path.resolve(f)).isDirectory());
}

function buildFile(packagesDir, file, isBuildEs) {
  const BUILD_DIR = isBuildEs ? 'es' : 'lib';
  const packageName = path.relative(packagesDir, file).split(path.sep)[0];
  const packageSrcPath = path.resolve(packagesDir, packageName, SRC_DIR);
  const packageBuildPath = path.resolve(packagesDir, packageName, BUILD_DIR);
  const relativeToSrcPath = path.relative(packageSrcPath, file);
  const destPath = path.resolve(packageBuildPath, relativeToSrcPath);

  let babelOptions;
  if (isBuildEs) {
    babelOptions = getBabelConfig(true);
  } else {
    babelOptions = getBabelConfig();
  }

  spawnSync('mkdir', ['-p', path.dirname(destPath)]);
  if (!minimatch(file, IGNORE_PATTERN)) {
    if (!minimatch(file, JS_FILES_PATTERN)) {
      fs.createReadStream(file).pipe(fs.createWriteStream(destPath));
    } else {
      const transformed = babel.transformFileSync(file, babelOptions).code;
      spawnSync('mkdir', ['-p', path.dirname(destPath)]);
      fs.writeFileSync(destPath, transformed);
    }
  }
}

// const packagesDir = path.resolve(__dirname, '../packages');
module.exports = function compile(packagesName, isBuildEs) {
  const packagesDir = path.resolve(__dirname, `../${packagesName}`);
  const packages = getPackages(packagesDir, customPackages);

  if (args.watch) {
    // watch packages
    const watchPackagesDir = packages.map(dir => path.resolve(dir, SRC_DIR));

    console.log(chalk.green('watch packages compile', packages));

    chokidar.watch(watchPackagesDir, {
      ignored: IGNORE_PATTERN
    }).on('change', (filePath) => {
      const packageName = filePath.match( new RegExp(`\/${packagesName}\/([^\/]*)`))[1];
      const packagePath = path.resolve(__dirname, `../${packagesName}/`, packageName);
      process.stdout.write(chalk.bold.inverse(`Compiling package ${packageName} \n`));
      try {
        buildPackage(packagesDir, packagePath, isBuildEs);
      } catch (e) {}
      process.stdout.write('\n');
    });
  } else {
    process.stdout.write(chalk.bold.inverse('Compiling packages\n'));
    packages.forEach((v) => {
      buildPackage(packagesDir, v, isBuildEs);
    });
    process.stdout.write('\n');
  }
};
