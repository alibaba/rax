const { resolve } = require('path');
const { readFileSync } = require('fs-extra');
const compiler = require('jsx-compiler');
const Component = require('./Component');
const { writeFile } = require('../utils/file');

/**
 * Abstract of miniapp page.
 * @type {module.Page}
 */
module.exports = class Page {
  /**
   * @param options {Object}
   */
  constructor(options) {
    const { rootContext, context, distRoot, distPagePath } = options;
    this.rootContext = rootContext;
    this.context = context;
    this.distPagePath = distPagePath;

    this._transformJSX();
    this._creatComponents();
    this._writeFiles();
  }

  /**
   * Read jsx file & transform jsx code by compiler
   * @private
   */
  _transformJSX() {
    const pageJSXPath = this.context + '.jsx';
    const jsxCode = readFileSync(pageJSXPath, 'utf-8');

    this.transformed = compiler(jsxCode, Object.assign({}, compiler.baseOptions, {
      filePath: pageJSXPath,
      type: 'page',
    }));
  }

  /**
   * Creat components
   * @private
   */
  _creatComponents() {
    new Component(
      {usingComponents: this.transformed.usingComponents},
      { rootContext: this.rootContext, context: this.context, distPath: this.distPagePath });
  }

  /**
   * Write file
   * @private
   */
  _writeFiles() {
    writeFile(resolve(this.distPagePath, 'index.json'), JSON.stringify(this.transformed.config, null, 2) + '\n', this.rootContext);
    writeFile(resolve(this.distPagePath, 'index.acss'), this.transformed.style, this.rootContext);
    writeFile(resolve(this.distPagePath, 'index.axml'), this.transformed.template, this.rootContext);
    writeFile(resolve(this.distPagePath, 'index.js'), this.transformed.code, this.rootContext);
  }
};
