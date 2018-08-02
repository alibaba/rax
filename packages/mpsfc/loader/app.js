const { stringifyRequest, getOptions } = require('loader-utils');
const vueCompiler = require('vue-template-compiler');
const { compileES5, getBabelrc, getAppJSON } = require('../utils');
const babel = require('babel-core');
const { readFileSync, existsSync } = require('fs');
const { resolve, parse } = require('path');

/**
 *  
 */
module.exports = function appLoader(content) {
  /**
   * handle with app.json
   */
  const appJSON = getAppJSON(this.rootContext);
  this.emitFile('app.json', JSON.stringify(appJSON, null, 2) + '\n');
  this.emitFile('assets/app.js', content.replace(/@core\/app/, '/assets/vendor/coreApp.js') + '\nmodule.exports = app;');

  /**
   * handle with app.css
   */
  const appCSSPath = resolve(this.rootContext, 'app.css');
  if (existsSync(appCSSPath)) {
    this.addDependency(appCSSPath);
    const styleContent = readFileSync(appCSSPath, 'utf-8');
    this.emitFile('app.acss', styleContent);
  }

  /**
   * handle with app.js
   */
  const source = `App(require('/assets/vendor/transAppConfig')(require('/assets/app')));`;
  this.callback(null, source);
}
