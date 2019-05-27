const { join, resolve } = require('path');
const { readFileSync, readJSONSync, existsSync } = require('fs-extra');
const { createPage } = require('./Page');
const { writeFile } = require('../utils/file');
const { transformJSX } = require('./Transformer');

const DEP = 'dependencies';
const DEV_DEP = 'devDependencies';

/**
 * Create page files
 * @param appDirectory {String} Absolute app path.
 * @param distDirectory {String} Absolute dist path.
 */
const createChildPage = function(appDirectory, distDirectory) {
  const sourceConfigPath = join(appDirectory, 'app.json');
  const config = readJSONSync(sourceConfigPath);
  const pages = config.pages;
  for (let i = 0, l = pages.length; i < l; i++) {
    createPage(
      appDirectory,
      distDirectory,
      pages[i]
    );
  }
};

/**
 * copy app files to dist
 * @param appDirectory {String} Absolute app path.
 * @param distDirectory {String} Absolute dist path.
 */
const copyAppFiles = function(appDirectory, distDirectory) {
  const sourceScriptPath = join(appDirectory, 'app.js');
  const sourceStylePath = join(appDirectory, 'app.css');
  const sourcePackageJSON = join(appDirectory, 'package.json');
  const transformed = transformJSX(sourceScriptPath, 'app');
  const { config = {}, code = '' } = transformed;

  const packageConfig = readJSONSync(sourcePackageJSON);

  let style;
  if (existsSync(sourceStylePath)) {
    style = readFileSync(sourceStylePath, 'utf-8');
  }

  // Remove rax in dependencies.
  if (packageConfig[DEP] && packageConfig[DEP].hasOwnProperty('rax')) {
    delete packageConfig[DEP].rax;
  }
  // Remove devDeps.
  if (packageConfig[DEV_DEP]) {
    delete packageConfig[DEV_DEP];
  }

  writeFile(join(distDirectory, 'app.js'), code, appDirectory);
  writeFile(join(distDirectory, 'app.json'), JSON.stringify(config, null, 2), appDirectory);
  writeFile(join(distDirectory, 'package.json'), JSON.stringify(packageConfig, null, 2), appDirectory);

  if (style) {
    writeFile(join(distDirectory, 'app.acss'), style, appDirectory);
  }
};

/**
 * Create app
 * @param appDirectory {String} Absolute app path.
 * @param distDirectory {String} Absolute dist path.
 */
const createApp = function(appDirectory, distDirectory) {
  copyAppFiles(appDirectory, distDirectory);
  createChildPage(appDirectory, distDirectory);
};

module.exports = {
  createApp
};
