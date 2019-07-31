const path = require('path');
const babel = require('@babel/core');
const { RawSource } = require('webpack-sources');
const { readFileSync, existsSync } = require('fs');

const babelConfig = require('../config/babel.config.js');

module.exports = class UniversalDocumentPlugin {
  constructor(options) {
    if (!options.render) {
      throw new Error('Document file need a render');
    }
    this.render = options.render;

    if (!options.path) {
      throw new Error('Please specify document file location with the path attribute');
    }

    this.rootDir = options.rootDir ? options.rootDir : process.cwd();
    this.documentPath = options.path ? options.path : 'src/document/index.jsx';
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('UniversalDocumentPlugin', (compilation, callback) => {
      const filename = path.resolve(this.rootDir, this.documentPath);
      if (!existsSync(filename)) throw new Error(`File ${filename} is not exists, please check.`);

      // get document code
      const fileContent = readFileSync(filename, 'utf-8');
      const { code } = babel.transformSync(fileContent, babelConfig);

      // code export
      const fn = new Function('module', 'exports', 'require', code);
      fn({ exports: {} }, module.exports, require);
      const documentElement = module.exports.__esModule ? module.exports.default : module.exports;

      // get document html string
      const source = this.render(require('rax').createElement(documentElement, {
        styles: ['/index.web.css'],
        scripts: ['/index.web.js'],
      }));

      // insert html file
      compilation.assets['index.html'] = new RawSource(source);

      callback();
    });
  }
};
