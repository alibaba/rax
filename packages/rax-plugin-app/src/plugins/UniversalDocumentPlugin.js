const path = require('path');
const babel = require('@babel/core');
const { RawSource } = require('webpack-sources');
const { readFileSync, existsSync } = require('fs');
const { getBabelConfig } = require('rax-compile-config');

const babelConfig = getBabelConfig();

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
      const config = compilation.options;
      const isDev = config.mode === 'development';
      const publicPath = isDev ? config.devServer.publicPath : config.output.publicPath;

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
        publicPath,
        styles: [],
        scripts: ['web/index.js'],
      }));

      // insert html file
      compilation.assets['index.html'] = new RawSource(source);

      callback();
    });
  }
};
