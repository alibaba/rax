const { join } = require('path');
const { writeFileSync, writeJSONSync } = require('fs-extra');
const Watcher = require('./Watcher');

class App extends Watcher {
  /**
   * @param appSource {AppSource}
   * @param transformerOption {TransformerOption}
   */
  constructor(appSource, transformerOption) {
    super();
    const { script, config, style } = appSource;
    const { watch, appDirectory, distDirectory } = transformerOption;
    this.script = script;
    this.style = style;
    this.config = config;

    this.scriptPath = join(distDirectory, 'app.js');
    this.stylePath = join(distDirectory, 'app.acss');
    this.configPath = join(distDirectory, 'app.json');

    this.dependencyPages = [];
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
