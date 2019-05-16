const { resolve, relative } = require('path');
const { ensureFileSync, readFileSync, writeFileSync } = require('fs-extra');
const compiler = require('jsx-compiler');
const Component = require('./Component');
const colors = require('colors');

/**
 * Abstract of miniapp page.
 * @type {module.Page}
 */
module.exports = class Page {
  constructor(options) {
    const { rootContext, context, distRoot, distPagePath } = options;
    this.rootContext = rootContext;
    this.context = context;
    this.distPagePath = distPagePath;

    const pageJSXPath = context + '.jsx';
    const jsxCode = readFileSync(pageJSXPath, 'utf-8');

    // { template, code, customComponents, config, style }
    const transformed = compiler(jsxCode, Object.assign({}, compiler.baseOptions, {
      filePath: pageJSXPath,
      type: 'page',
    }));

    new Component(
      {usingComponents: transformed.usingComponents},
      { rootContext, context, distPath: distPagePath });

    this.script = transformed.code;
    this.template = transformed.template;
    this.style = transformed.style;
    this.config = transformed.config;

    this._writeFiles();
  }

  _writeFiles() {
    this._writeConfig();
    this._writeStyle();
    this._writeTemplate();
    this._writeScript();
  }

  _writeConfig() {
    this._writeFile(resolve(this.distPagePath, 'index.json'), JSON.stringify(this.config, null, 2) + '\n');
  }
  _writeStyle() {
    this._writeFile(resolve(this.distPagePath, 'index.acss'), this.style);
  }
  _writeTemplate() {
    this._writeFile(resolve(this.distPagePath, 'index.axml'), this.template);
  }
  _writeScript() {
    this._writeFile(resolve(this.distPagePath, 'index.js'), this.script);
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
