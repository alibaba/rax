const path = require('path');
const { RawSource } = require('webpack-sources');
const { existsSync, unlinkSync } = require('fs');

const NAME = 'PWAAppShellPlugin';
const FILE_NAME = '__PWA_APP_SHELL__';

const interopRequire = (obj) => {
  return obj && obj.__esModule ? obj.default : obj;
};

// The App-Shell component will be pre-rendered to index.html.
// When user loaded entry javascript file, it will hydrate the App-Shell component.
module.exports = class PWAAppShellPlugin {
  constructor(options) {
    this.render = options.render;
    this.rootDir = options.rootDir ? options.rootDir : process.cwd();
    this.shellPath = options.path ? options.path : 'src/shell/index.jsx';
  }

  apply(compiler) {
    const file = path.resolve(this.rootDir, this.shellPath);
    // Only Web projects are supported. Effective when the user directory contains 'shell/index.jsx'
    if (compiler.options.target !== 'web' || !existsSync(file)) return;

    const outputFilename = compiler.options.output.filename.replace('[name]', FILE_NAME);

    // Compile App-Shell
    compiler.hooks.entryOption.tap(NAME, (context, entry) => {
      entry[FILE_NAME] = [file];
    });

    // Render into index.html
    compiler.hooks.emit.tapAsync(NAME, async(compilation, callback) => {
      const htmlValue = compilation.assets['index.html'].source();
      const shellValue = compilation.assets[outputFilename].source();
      const AppShell = interopRequire(eval('var window = {};' + shellValue));
      const content = this.render(require('rax').createElement(AppShell, {}));

      // Pre-render App-Shell renderToString element to index.html
      compilation.assets['index.html'] = new RawSource(htmlValue.replace(
        /<div(.*?) id=\"root\">(.*?)<\/div>/,
        `<div id="root">${content}</div>`
      ));

      callback();
    });


    // Delete temp files
    compiler.hooks.done.tap(NAME, () => {
      if (compiler.options.mode === 'production' || !compiler.options.mode) {
        const jsFile = path.join(compiler.options.output.path, outputFilename);
        const mapFile = jsFile + '.map';

        existsSync(jsFile) && unlinkSync(jsFile);
        existsSync(mapFile) && unlinkSync(mapFile);
      }
    });
  }
};
