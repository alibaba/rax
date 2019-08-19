const path = require('path');
const { RawSource } = require('webpack-sources');
const { existsSync, unlinkSync } = require('fs');
const { createElement } = require('rax');
const { renderToString } = require('rax-server-renderer');

const NAME = 'PWAAppShellPlugin';
const FILE_NAME = '__PWA_APP_SHELL__';

const interopRequire = (obj) => {
  return obj && obj.__esModule ? obj.default : obj;
};

// The App-Shell component will be pre-rendered to index.html.
// When user loaded entry javascript file, it will hydrate the App-Shell component.
module.exports = class PWAAppShellPlugin {
  constructor(options) {
    if (!options.path) {
      throw new Error('Please specify shell file location with the path attribute');
    }

    this.shellPath = options.path ? options.path : 'src/shell/index.jsx';
  }

  apply(compiler) {
    const config = compiler.options;
    const file = path.resolve(config.context, this.shellPath);
    // Only Web projects are supported. Effective when the user directory contains 'shell/index.jsx'
    if (config.target !== 'web' || !existsSync(file)) return;

    const outputFilename = config.output.filename.replace('[name]', FILE_NAME);

    // Compile App-Shell
    compiler.hooks.entryOption.tap(NAME, (context, entry) => {
      entry[FILE_NAME] = [file];
    });

    // Render into index.html
    compiler.hooks.emit.tapAsync(NAME, async(compilation, callback) => {
      const shellValue = compilation.assets[outputFilename].source();
      const AppShell = interopRequire(eval('var window = {};' + shellValue));
      const content = renderToString(createElement(AppShell, {}));

      // Pre-render App-Shell renderToString element to index.html
      const entryObj = compilation.options.entry;
      Object.keys(entryObj).forEach(entry => {
        const pageHtmlValue = compilation.assets[`web/${entry}.html`].source();
        compilation.assets[`web/${entry}.html`] = new RawSource(pageHtmlValue.replace(
          /<div(.*?) id=\"root\">(.*?)<\/div>/,
          `<div id="root">${content}</div>`
        ));
      });

      callback();
    });


    // Delete temp files
    compiler.hooks.done.tap(NAME, () => {
      if (config.mode === 'production' || !config.mode) {
        const jsFile = path.join(config.output.path, outputFilename);
        const mapFile = jsFile + '.map';
        const htmlFile = jsFile.replace(/\.js$/, '.html');

        existsSync(jsFile) && unlinkSync(jsFile);
        existsSync(mapFile) && unlinkSync(mapFile);
        existsSync(htmlFile) && unlinkSync(htmlFile);
      }
    });
  }
};
