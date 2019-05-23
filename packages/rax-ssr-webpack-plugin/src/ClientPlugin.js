const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const getShellConfig = require('./webpack.shell.js');

const { createElement } = require('rax');
const renderer = require('rax-server-renderer');

const NAME = 'rax-client-webpack-plugin';

class ClientPlugin {
  constructor(options) {
    this.ready = false;
    this.options = options;
  }

  apply(compiler) {
    // Add new root dom "root-shell" to render app-shell.
    compiler.hooks.compilation.tap(NAME, bundle => {
      bundle.hooks.optimizeModules.tap(NAME, modules => {
        modules.forEach(mod => {
          if (mod.resource && mod.resource.indexOf('public/index.html') > -1) {
            mod._source._value = mod._source._value.replace('id="root"', 'id="root-shell"');
          }
        });
      });
    });

    // Compile app-shell files then write app-shell element string to html.
    compiler.hooks.done.tapAsync(NAME, (stats, callback) => {
      const pathConfig = this.options.pathConfig;
      webpack(getShellConfig(pathConfig)).run((err) => {
        if (err) {
          console.error(err);
          return false;
        }
        let html;
        const htmlPath = path.resolve(pathConfig.appBuild, './index.html');
        const shellJsPath = path.resolve(pathConfig.appBuild, './shells.js');

        const component = require(shellJsPath).default;
        const result = renderer.renderToString(createElement(component, {}, createElement('div', { id: 'root' })));
        html = fs.readFileSync(htmlPath, 'utf8');
        html = html.replace(
          '<div id="root-shell"></div>',
          `<div id="root-shell">${result}</div>`
        );
        fs.writeFileSync(htmlPath, html, 'utf8');
        fs.unlinkSync(shellJsPath);
        callback();
      });
    });
  }
}

module.exports = ClientPlugin;