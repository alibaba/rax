const { resolve, relative, extname } = require('path');
const { existsSync, ensureFileSync, readFileSync, readJSONSync, writeFileSync } = require('fs-extra');
const transform = require('jsx-compiler');
const Component = require('./Component');
const colors = require('colors');

/**
 * Abstract of miniapp page.
 * @type {module.Page}
 */
module.exports = class Page {
  constructor(options) {
    const { rootContext, context, distRoot, distPagePath, watch } = options;
    this.rootContext = rootContext;
    this.context = context;
    this.distPagePath = distPagePath;

    const pageConfigPath = context + '.json';
    const pageScriptPath = context + '.js';
    const pageJSXPath = context + '.jsx';
    const pageStylePath = context + '.acss';

    const jsxCode = readFileSync(pageJSXPath, 'utf-8');
    const scriptCode = readFileSync(pageScriptPath, 'utf-8');
    const pageConfig = existsSync(pageConfigPath) ? readJSONSync(pageConfigPath) : {};
    const pageStyle = existsSync(pageStylePath) ? readFileSync(pageStylePath, 'utf-8') : '';

    // { template, jsCode, customComponents,, style }
    const transformed = transform(jsxCode, { filePath: pageJSXPath, rootContext });

    const delegateComponentPath = resolve(distPagePath, 'components');
    this._delegateComponent = new Component({
      script: transformed.jsCode,
      style: transformed.style || '',
      config: this.generateComponentConfig(transformed.customComponents),
      template: transformed.template,
    }, { rootContext, context, distRoot, distPath: delegateComponentPath });

    this.script = scriptCode;
    this.template = '<page></page>';
    this.style = pageStyle;
    this.config = Object.assign({}, pageConfig, {
      usingComponents: { page: './components/index'},
    });

    this._writeFiles();
  }

  generateComponentConfig(customComponents = {}) {
    const usingComponents = {};
    Object.keys(customComponents).forEach((name) => {
      let { tagName, filePath } = customComponents[name];
      // Remove extension.
      filePath = filePath.replace(extname(filePath), '') + '/index';
      usingComponents[tagName] = '/' + relative(this.rootContext, filePath);
    });
    return {
      component: true,
      usingComponents,
    };
  }

  _writeFiles() {
    this._delegateComponent._writeFiles();
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
