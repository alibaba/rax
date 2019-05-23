const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const getShellConfig = require('./ShellWebpackConfig.js');

const { createElement } = require('rax');
const renderer = require('rax-server-renderer');

const NAME = 'rax-client-webpack-plugin';

class ClientPlugin {
  constructor(options) {
    this.ready = false;
    this.options = options;
    this.AppShellTemplate = '';
  }

  apply(compiler) {
    compiler.hooks.beforeCompile.tapAsync(NAME, (compilationParams, callback) => {
      const pathConfig = this.options.pathConfig;
      webpack(getShellConfig(pathConfig)).run((err) => {
        if (err) {
          console.error(err);
          return false;
        }
        const shellJsPath = path.resolve(pathConfig.appBuild, './shells.js');
        const component = require(shellJsPath).default;

        this.AppShellTemplate = renderer.renderToString(createElement(component, {}, createElement('div', { id: 'root' })));
        fs.unlinkSync(shellJsPath);
        callback();
      });
    });

    compiler.hooks.compilation.tap(NAME, bundle => {
      bundle.hooks.optimizeModules.tap(NAME, modules => {
        modules.forEach(mod => {
          if (mod.resource && mod.resource.indexOf('public/index.html') > -1) {
            mod._source._value = mod._source._value.replace(
              '<div id="root"></div>',
              `<div id="root-shell">${this.AppShellTemplate}</div>`
            );
          }
        });
      });
    });
  }
}

module.exports = ClientPlugin;