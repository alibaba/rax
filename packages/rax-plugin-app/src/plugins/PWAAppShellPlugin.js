const path = require('path');
const babel = require('@babel/core');
const { RawSource } = require('webpack-sources');
const { readFileSync, existsSync } = require('fs');

const babelConfig = require('../config/babel.config.js');

const NAME = 'PWAAppShellPlugin';

module.exports = class PWAAppShellPlugin {
  constructor(options) {
    this.render = options.render;

    this.rootDir = options.rootDir ? options.rootDir : process.cwd();
    this.shellPath = options.path ? options.path : 'src/shell/index.jsx';
  }

  apply(compiler) {
    const filename = path.resolve(this.rootDir, this.shellPath);
    if (!existsSync(filename)) return;

    // render to index html
    compiler.hooks.emit.tapAsync(NAME, (compilation, callback) => {
      const htmlValue = compilation.assets['index.html'].source();

      // get shell code
      const fileContent = readFileSync(filename, 'utf-8');
      const { code } = babel.transformSync(fileContent, babelConfig);

      // code export
      const fn = new Function('module', 'exports', 'require', code);
      fn({ exports: {} }, module.exports, require);
      const shellElement = module.exports.__esModule ? module.exports.default : module.exports;

      // get shell element string
      const source = this.render(require('rax').createElement(shellElement, {}));

      compilation.assets['index.html'] = new RawSource(htmlValue.replace(
        /<div(.*?) id=\"root\">(.*?)<\/div>/,
        `<div id="root">${source}</div>`
      ));

      callback();
    });
  }
};
