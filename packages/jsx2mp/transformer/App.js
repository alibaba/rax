const { join, resolve } = require('path');
const { readFileSync, writeFileSync, writeJSONSync, readJSONSync, existsSync, readdir } = require('fs-extra');
const { statSync, readdirSync } = require('fs');
const Page = require('./Page');
const Component = require('./Component');

const DEP = 'dependencies';
const DEV_DEP = 'devDependencies';

module.exports = class App {
  /**
   * @param sourcePath {String} path to source directory.
   * @param transformerOption {Object}
   */
  constructor(sourcePath, transformerOption) {
    const { appDirectory, distDirectory } = transformerOption;
    this.appDirectory = appDirectory;
    this.distDirectory = distDirectory;

    const sourceScriptPath = join(appDirectory, 'app.js');
    const sourceStylePath = join(appDirectory, 'app.css');
    const sourceConfigPath = join(appDirectory, 'app.json');
    const sourcePackageJSON = join(appDirectory, 'package.json');
    if (!existsSync(sourceConfigPath)) {
      throw new Error('app.json not exists.');
    }

    const config = this.config = readJSONSync(sourceConfigPath);
    const packageConfig = this.packageConfig = readJSONSync(sourcePackageJSON);
    const script = this.script = readFileSync(sourceScriptPath, 'utf-8');
    const style = this.style = readFileSync(sourceStylePath, 'utf-8');

    // Remove rax in dependencies.
    if (packageConfig[DEP] && packageConfig[DEP].hasOwnProperty('rax')) {
      delete packageConfig[DEP].rax;
    }
    // Remove devDeps.
    if (packageConfig[DEV_DEP]) {
      delete packageConfig[DEV_DEP];
    }

    const pages = config.pages;

    for (let i = 0, l = pages.length; i < l; i++) {
      const pageInstance = new Page({
        rootContext: sourcePath,
        context: resolve(sourcePath, pages[i]),
        distRoot: distDirectory,
        distPagePath: resolve(distDirectory, pages[i], '..')
      });
    }

    this._writeFiles();
  }

  _writeFiles() {
    writeFileSync(join(this.distDirectory, 'app.js'), this.script);
    writeFileSync(join(this.distDirectory, 'app.acss'), this.style);
    writeJSONSync(join(this.distDirectory, 'app.json'), this.config);
    writeJSONSync(join(this.distDirectory, 'package.json'), this.packageConfig);
  }
};
