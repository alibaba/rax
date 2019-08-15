const path = require('path');
const babel = require('@babel/core');
const { RawSource } = require('webpack-sources');
const { readFileSync, existsSync } = require('fs');
const { getBabelConfig } = require('rax-compile-config');
const { createElement } = require('rax');
const { renderToString } = require('rax-server-renderer');

const babelConfig = getBabelConfig();

module.exports = class UniversalDocumentPlugin {
  constructor(options) {
    if (!options.path) {
      throw new Error('Please specify document file location with the path attribute');
    }

    this.documentPath = options.path ? options.path : 'src/document/index.jsx';
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('UniversalDocumentPlugin', (compilation, callback) => {
      const config = compilation.options;
      const publicPath = config.output.publicPath;

      const filename = path.resolve(config.context, this.documentPath);
      if (!existsSync(filename)) throw new Error(`File ${filename} is not exists, please check.`);

      // get document code
      const fileContent = readFileSync(filename, 'utf-8');
      const { code } = babel.transformSync(fileContent, babelConfig);

      // code export
      const fn = new Function('module', 'exports', 'require', code);
      fn({ exports: {} }, module.exports, require);
      const documentElement = module.exports.__esModule ? module.exports.default : module.exports;

      const entryObj = config.entry;
      Object.keys(entryObj).forEach(entry => {
        // get document html string
        const pageSource = renderToString(createElement(documentElement, {
          publicPath,
          styles: [],
          scripts: [`web/${entry}.js`],
        }));
        // insert html file
        compilation.assets[`web/${entry}.html`] = new RawSource(pageSource);
      });

      callback();
    });
  }
};
