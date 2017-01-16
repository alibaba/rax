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

const babel = require('babel-core');
const chalk = require('chalk');
const glob = require('glob');
const minimatch = require('minimatch');
const parseArgs = require('minimist');
const chokidar = require('chokidar');

const SRC_DIR = 'src';
const BUILD_DIR = 'lib';
const JS_FILES_PATTERN = '**/*.js';
const IGNORE_PATTERN = '**/__tests__/**';
const PACKAGES_DIR = path.resolve(__dirname, '../packages');

const args = parseArgs(process.argv);
const customPackages = args.packages;

const babelOptions = JSON.parse(fs.readFileSync(
  path.resolve(__dirname, '..', '.babelrc'),
  'utf8'
));
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

  files.forEach(file => buildFile(file, true));
  process.stdout.write(`[  ${chalk.green('OK')}  ]\n`);
}

function getPackages(customPackages) {
  return fs.readdirSync(PACKAGES_DIR)
    .map(file => path.resolve(PACKAGES_DIR, file))
    .filter(f => {
      if (customPackages) {
        const packageName = path.relative(PACKAGES_DIR, f).split(path.sep)[0];
        return customPackages.indexOf(packageName) !== -1;
      } else {
        return true;
      }
    })
    .filter(f => fs.lstatSync(path.resolve(f)).isDirectory());
}

function buildFile(file, silent) {
  const packageName = path.relative(PACKAGES_DIR, file).split(path.sep)[0];
  const packageSrcPath = path.resolve(PACKAGES_DIR, packageName, SRC_DIR);
  const packageBuildPath = path.resolve(PACKAGES_DIR, packageName, BUILD_DIR);
  const relativeToSrcPath = path.relative(packageSrcPath, file);
  const destPath = path.resolve(packageBuildPath, relativeToSrcPath);

  spawnSync('mkdir', ['-p', path.dirname(destPath)]);
  if (minimatch(file, IGNORE_PATTERN)) {
    silent || process.stdout.write(
      chalk.dim('  \u2022 ') +
      path.relative(PACKAGES_DIR, file) +
      ' (ignore)\n'
    );
  } else if (!minimatch(file, JS_FILES_PATTERN)) {
    fs.createReadStream(file).pipe(fs.createWriteStream(destPath));
    silent || process.stdout.write(
      chalk.red('  \u2022 ') +
      path.relative(PACKAGES_DIR, file) +
      chalk.red(' \u21D2 ') +
      path.relative(PACKAGES_DIR, destPath) +
      ' (copy)' +
      '\n'
    );
  } else {
    const transformed = babel.transformFileSync(file, babelOptions).code;
    spawnSync('mkdir', ['-p', path.dirname(destPath)]);
    fs.writeFileSync(destPath, transformed);
    silent || process.stdout.write(
      chalk.green('  \u2022 ') +
      path.relative(PACKAGES_DIR, file) +
      chalk.green(' \u21D2 ') +
      path.relative(PACKAGES_DIR, destPath) +
      '\n'
    );
  }
}

if (args.watch) {
  // watch packages
  const packages = getPackages(customPackages);
  const watchPackagesDir = packages.map(dir => path.resolve(dir, 'src'));

  console.log(chalk.green('watch packages compile', packages));

  chokidar.watch(watchPackagesDir, {
    ignored: IGNORE_PATTERN
  }).on('all', (event, filePath) => {
    if (event !== 'change') {
      return;
    }
    const packageName = filePath.match(/rax\/packages\/([^\/]*)/)[1];
    const packagePath = path.resolve(__dirname, '../packages/', packageName);
    process.stdout.write(chalk.bold.inverse(`Compiling package ${packageName} \n`));
    buildPackage(packagePath);
    process.stdout.write('\n');
  });
} else {
  process.stdout.write(chalk.bold.inverse('Compiling packages\n'));
  getPackages(customPackages).forEach(buildPackage);
  process.stdout.write('\n');
}
