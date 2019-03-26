const { ensureFileSync, writeFileSync, readJSONSync, existsSync, readFileSync } = require('fs-extra');
const { join, resolve, relative } = require('path');
const Watcher = require('./Watcher');
const { transformJSX } = require('./transformJSX');
const colors = require('colors');

/**
 * Abstract of miniapp component.
 * @type {module.TransformerComponent}
 */
module.exports = class TransformerComponent extends Watcher {
  constructor({ script, template, style = '', config = {} }, options = {}) {
    super();
    const { rootContext, context, distRoot, distPath } = options;
    this.rootContext = rootContext;
    this.context = context;

    this.scriptPath = resolve(distPath, 'index.js');
    this.templatePath = resolve(distPath, 'index.axml');
    this.stylePath = resolve(distPath, 'index.acss');
    this.configPath = resolve(distPath, 'index.json');

    this.deps = [];
    this.script = script;
    this.template = template;
    this.style = style;
    this.config = config;

    const { usingComponents = {} } = config;
    Object.keys(usingComponents).forEach((tagName) => {
      const sourcePath = usingComponents[tagName].replace(/\/index$/, '');
      const componentSourcePath = join(rootContext, sourcePath);
      const componentDistPath = join(distRoot, sourcePath);

      const sourceConfigPath = componentSourcePath + '.json';
      const sourceConfig = existsSync(sourceConfigPath) ? readJSONSync(sourceConfigPath) : {};
      const depConfig = Object.assign({}, sourceConfig, { component: true });

      const sourceJSXPath = componentSourcePath + '.jsx';
      const jsxFileContent = readFileSync(sourceJSXPath, 'utf-8');
      const transformed = transformJSX(jsxFileContent, { filePath: sourceJSXPath, rootContext });

      const componentDep = new TransformerComponent({
        script: transformed.jsCode,
        template: transformed.template,
        style: transformed.style,
        config: depConfig,
      }, { rootContext, context: componentSourcePath, distRoot, distPath: componentDistPath });
      this.deps.push(componentDep);
    });

    if (options.watch) {
      this.watch();
    }
  }

  write() {
    this._writeStyle();
    this._writeTemplate();
    this._writeScript();
    this._writeConfig();

    for (let i = 0, l = this.deps.length; i < l; i++ ) {
      this.deps[i].write();
    }
  }

  _writeTemplate() {
    this._writeFile(this.templatePath, this.template);
  }

  _writeStyle() {
    this._writeFile(this.stylePath, this.style);
  }

  _writeScript() {
    this._writeFile(this.scriptPath, this.script);
  }

  _writeConfig() {
    this._writeFile(this.configPath, JSON.stringify(this.config, null, 2) + '\n');
  }

  /**
   * Write file and ensure folder exists.
   * @param path {String} File path.
   * @param content {String} File content.
   * @private
   */
  _writeFile(path, content) {
    ensureFileSync(path);
    console.log(colors.green('Write'), relative(this.rootContext, path));
    writeFileSync(path, content, 'utf-8');
  }
};
