const { ensureFileSync, writeFileSync, readJSONSync, existsSync, readFileSync } = require('fs-extra');
const { join, resolve, relative } = require('path');
const compiler = require('jsx-compiler');
const colors = require('colors');

/**
 * Abstract of miniapp component.
 * @type {module.Component}
 */
module.exports = class Component {
  constructor(config = {}, options = {}) {
    const { rootContext, context, distPath } = options;
    this.rootContext = rootContext;
    this.context = context;

    const { usingComponents = {} } = config;

    for (let [key, value] of usingComponents) {
      if (!value.external) {
        const componentDistPath = join(distPath, value.from);
        const componentSourcePath = value.absolutePath;

        const sourceJSXPath = componentSourcePath;
        const jsxFileContent = readFileSync(sourceJSXPath, 'utf-8');
        const transformed = compiler(jsxFileContent, Object.assign({}, compiler.baseOptions, {
          filePath: sourceJSXPath,
          type: 'component',
        }));

        const scriptPath = componentDistPath + '.js';
        const templatePath = componentDistPath + '.axml';
        const stylePath = componentDistPath + '.acss';
        const configPath = componentDistPath + '.json';

        this._writeTemplate(templatePath, transformed.template);
        this._writeConfig(configPath, transformed.config);
        this._writeScript(scriptPath, transformed.code);
        this._writeStyle(stylePath, transformed.style);

        new Component(
          {usingComponents: transformed.usingComponents},
          { rootContext, context, distPath});
      }
    }
  }

  _writeTemplate(templatePath, template) {
    this._writeFile(templatePath, template);
  }

  _writeStyle(stylePath, style) {
    this._writeFile(stylePath, style);
  }

  _writeScript(scriptPath, script) {
    this._writeFile(scriptPath, script);
  }

  _writeConfig(configPath, config) {
    this._writeFile(configPath, JSON.stringify(config, null, 2) + '\n');
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
