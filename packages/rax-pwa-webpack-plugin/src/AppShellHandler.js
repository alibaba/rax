const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const { createElement } = require('rax');
const renderer = require('rax-server-renderer');

const interopRequire = require('./interopRequire');
const getWebpackNodeConfig = require('./getWebpackNodeConfig');

class AppShellHandler {
  constructor(options) {
    this.options = options;
    const { appDirectory } = this.options;
    this.tempShellFileName = '_shell';
    this.tempShellFilePath = path.resolve(appDirectory, '.temp', this.tempShellFileName + '.js');
  }

  build(next) {
    const { appDirectory, appShell } = this.options;
    const webpackShellConfig = getWebpackNodeConfig(appDirectory);
    webpackShellConfig.entry[this.tempShellFileName] = appShell;
    webpack(webpackShellConfig).run(() => {
      next('appShell');
    });
  }

  getContent() {
    const content = renderer.renderToString(
      createElement(interopRequire(eval(fs.readFileSync(this.tempShellFilePath, 'utf-8'))), {
        Component: () => createElement('div', { id: 'root-page' })
      })
    );
    return content;
  }
}

module.exports = AppShellHandler;
