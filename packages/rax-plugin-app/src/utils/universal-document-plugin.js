const { RawSource } = require('webpack-sources');
const babel = require('@babel/core');
const { readFileSync, existsSync } = require('fs');
const path = require('path');
const cwd = process.cwd();

const babelConfig = require('./babel.config.js');

module.exports = class UniversalDocumentPlugin {
  constructor(options) {
    if (!options.render) {
      throw new Error('document need render');
    }
    this.render = options.render;
    
    this.documentPath = 'src/document/index.jsx';

    if (options.path) {
      this.documentPath = options.path
    }
  }

  apply(compiler) {
    // emit is asynchronous hook, tapping into it using tapAsync, you can use tapPromise/tap(synchronous) as well
    compiler.hooks.emit.tapAsync('UniversalDocumentPlugin', (compilation, callback) => {
      const filename = path.resolve(cwd, this.documentPath);
      if (!existsSync(filename)) throw new Error(`File ${filename} is not exists, please check.`);

      const fileContent = readFileSync(filename, 'utf-8');
      const { code } = babel.transformSync(fileContent, babelConfig);

      const fn = new Function('module', 'exports', 'require', code);
      const module = { exports: {} };
      fn(module, module.exports, require);
      const exported = module.exports.__esModule ? module.exports.default : module.exports;
      const source = this.render(require('rax').createElement(exported, { 
        styles: [],
        scripts: ['/index.web.js'],

      }));
     
      // Insert this list into the webpack build as a new file asset:
      compilation.assets['index.html'] = new RawSource(source);

      callback();
    });
  }
}
