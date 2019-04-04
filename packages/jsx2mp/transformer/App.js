const { join, resolve } = require('path');
const { readFileSync, writeFileSync, writeJSONSync, readJSONSync, existsSync } = require('fs-extra');
const TransformerPage = require('./Page');
// const Watcher = require('./Watcher');

class App {
  /**
   * @param sourcePath {String} path to source directory.
   * @param transformerOption {Object}
   */
  constructor(sourcePath, transformerOption) {
    const { watch, appDirectory, distDirectory } = transformerOption;
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

    // Add rax as dependencies.
    ;(packageConfig.dependencies = packageConfig.dependencies || {}).rax = '^1.0.0';

    this.dependencyPages = [];
    const { pages } = config;
    for (let i = 0, l = pages.length; i < l; i++) {
      const pageInstance = new TransformerPage({
        rootContext: sourcePath,
        context: resolve(sourcePath, pages[i]),
        distRoot: distDirectory,
        distPagePath: resolve(distDirectory, pages[i], '..'),
        watch,
      });
      this.dependencyPages.push(pageInstance);
    }

    this.write();
  }

  write() {
    writeFileSync(join(this.distDirectory, 'app.js'), this.script);
    writeFileSync(join(this.distDirectory, 'app.acss'), this.style);
    writeJSONSync(join(this.distDirectory, 'app.json'), this.config);
    writeJSONSync(join(this.distDirectory, 'package.json'), this.packageConfig);
  }
}

module.exports = App;
