const { join } = require('path');
const { writeFileSync, writeJSONSync, readJSONSync } = require('fs-extra');
const TransformerPage = require('./Page');
// const Watcher = require('./Watcher');

const CONFIG_FILE = 'app.json';
const SCRIPT_FILE = 'app.js';
const STYLE_FILE = 'app.css';

class App /* extends Watcher */ {
  /**
   * @param sourcePath {String} path to source directory.
   * @param transformerOption {TransformerOption}
   */
  constructor(sourcePath, transformerOption) {
    // super();
    const appConfigPath = resolve(sourcePath, CONFIG_FILE);

    if (!existsSync(appConfigPath)) {
      throw new Error('app.json not exists.');
    }
    const appConfig = this.config = readJSONSync(appConfigPath);


    const { watch, appDirectory, distDirectory } = transformerOption;
    // this.script = script;
    // this.style = style;

    // this.scriptPath = join(distDirectory, 'app.js');
    // this.stylePath = join(distDirectory, 'app.acss');
    // this.configPath = join(distDirectory, 'app.json');

    this.dependencyPages = [];
    const { pages } = appConfig;
    for (let i = 0, l = pages.length; i < l; i++) {
      const pageInstance = new TransformerPage({
        rootContext: sourcePath,
        context: resolve(sourcePath, pages[i]),
        distRoot: distPath,
        distPagePath: resolve(distPath, pages[i], '..'),
        watch: enableWatch,
      });
      this.dependencyPages.push(pageInstance);
    }
  }

  write() {
    writeFileSync(this.scriptPath, this.script);
    writeFileSync(this.stylePath, this.style);
    writeJSONSync(this.configPath, this.config);
  }
}

/**
 * App source declaration.
 */
class AppSource {
  constructor({
    script,
    config,
    style = '', // optional
  }) {
    // Content of app.js
    this.script = script;

    // Content of app.acss
    this.style = style;

    // JS Object, app config.
    this.config = config;
  }
}

App.AppSource = AppSource;

module.exports = App;
