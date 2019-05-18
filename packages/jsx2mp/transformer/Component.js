const { readFileSync } = require('fs-extra');
const { join } = require('path');
const compiler = require('jsx-compiler');
const { writeFile } = require('../utils/file');

/**
 * Abstract of miniapp component.
 * @type {module.Component}
 */
module.exports = class Component {
  /**
   * @param options {Object}
   * @param config {Object}
   */
  constructor(config = {}, options = {}) {
    const { rootContext, context, distPath } = options;
    this.rootContext = rootContext;
    this.context = context;

    const { usingComponents = {} } = config;

    for (let [key, value] of usingComponents) {
      if (!value.external) {
        const componentDistPath = join(distPath, value.from);
        const componentSourcePath = value.absolutePath;

        const transformed = this._transformJSX(componentSourcePath);
        this._writeFiles(componentDistPath, transformed);
        this._creatComponents(transformed);
      }
    }
  }

  /**
   * Creat components
   * @private
   */
  _creatComponents(transformed) {
    new Component(
      {usingComponents: transformed.usingComponents},
      { rootContext: this.rootContext, context: this.context, distPath: this.distPagePath });
  }

  /**
   * Read jsx file & transform jsx code by compiler
   * @private
   */
  _transformJSX(componentSourcePath) {
    const jsxFileContent = readFileSync(componentSourcePath, 'utf-8');
    const transformed = compiler(jsxFileContent, Object.assign({}, compiler.baseOptions, {
      filePath: componentSourcePath,
      type: 'component',
    }));
    return transformed;
  }

  /**
   * Write file
   * @private
   */
  _writeFiles(componentDistPath, transformed) {
    writeFile(componentDistPath + '.axml', transformed.template, this.rootContext);
    writeFile(componentDistPath + '.json', JSON.stringify(transformed.config, null, 2) + '\n', this.rootContext);
    writeFile(componentDistPath + '.js', transformed.code, this.rootContext);
    writeFile(componentDistPath + '.acss', transformed.style, this.rootContext);
  }
};
