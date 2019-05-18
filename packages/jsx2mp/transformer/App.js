const { join, resolve } = require('path');
const { readFileSync, readJSONSync, existsSync} = require('fs-extra');
const Page = require('./Page');
const { writeFile } = require('../utils/file');

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
    this.rootContext = sourcePath;

    this._readFiles();
    this._creatPage();
    this._writeFiles();
  }

  /**
   * Read file
   * @private
   */
  _readFiles() {
    const sourceScriptPath = join(this.appDirectory, 'app.js');
    const sourceStylePath = join(this.appDirectory, 'app.css');
    const sourceConfigPath = join(this.appDirectory, 'app.json');
    const sourcePackageJSON = join(this.appDirectory, 'package.json');
    if (!existsSync(sourceConfigPath)) {
      throw new Error('app.json not exists.');
    }

    this.config = readJSONSync(sourceConfigPath);
    this.packageConfig = readJSONSync(sourcePackageJSON);
    this.script = readFileSync(sourceScriptPath, 'utf-8');
    this.style = readFileSync(sourceStylePath, 'utf-8');

    // Remove rax in dependencies.
    if (this.packageConfig[DEP] && this.packageConfig[DEP].hasOwnProperty('rax')) {
      delete this.packageConfig[DEP].rax;
    }
    // Remove devDeps.
    if (this.packageConfig[DEV_DEP]) {
      delete this.packageConfig[DEV_DEP];
    }
  }

  /**
   * Write file
   * @private
   */
  _writeFiles() {
    writeFile(join(this.distDirectory, 'app.js'), this.script, this.rootContext);
    writeFile(join(this.distDirectory, 'app.acss'), this.style, this.rootContext);
    writeFile(join(this.distDirectory, 'app.json'), JSON.stringify(this.config, null, 2), this.rootContext);
    writeFile(join(this.distDirectory, 'package.json'), JSON.stringify(this.packageConfig, null, 2), this.rootContext);
  }

  /**
   * Creat page by config
   * @private
   */
  _creatPage() {
    const pages = this.config.pages;
    for (let i = 0, l = pages.length; i < l; i++) {
      new Page({
        rootContext: this.rootContext,
        context: resolve(this.rootContext, pages[i]),
        distRoot: this.distDirectory,
        distPagePath: resolve(this.distDirectory, pages[i], '..')
      });
    }
  }
};
