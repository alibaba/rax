const { stringifyRequest, getOptions } = require('loader-utils');
const vueCompiler = require('vue-template-compiler');
const { compileES5, getBabelrc, getAppJSON } = require('../utils');
const babel = require('babel-core');
const { readFileSync } = require('fs');
const { resolve, parse } = require('path');

/**
 *  
 */
module.exports = function appLoader(content) {
  const { script, styles } = vueCompiler.parseComponent(content);
  const { resourcePath } = this;
  const mainJSPath = resolve(this.rootContext, 'main.js');
  this.addDependency(mainJSPath);
  let source = 'App({});'

  if (script) {
    source = [
      `var appConfig = require('./assets/app');`,
      `var transAppConfig = require('./assets/vendor/transAppConfig');`,
      `App(transAppConfig(appConfig));`
    ].join('\n');

    const { code, map } = compileES5(script.content, {
      sourceMaps: true
    });

    const appJSON = getAppJSON(this.rootContext);
    this.emitFile('app.json', JSON.stringify(appJSON, null, 2) + '\n');


    this.emitFile('assets/app.js', code, map);
  }


  if (Array.isArray(styles)) {
    const style = styles.map(s => s.content).join('\n');
    this.emitFile('app.acss', style);
  }

  this.callback(null, source);
}
