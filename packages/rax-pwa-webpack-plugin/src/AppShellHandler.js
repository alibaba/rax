const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const { createElement } = require('rax');
const renderer = require('rax-server-renderer');

const _ = require('./res/util');
const getWebpackNodeConfig = require('./res/getWebpackNodeConfig');
const purgeRequireCache = require('./res/purgeRequireCache');

class AppShellHandler {
  constructor(options) {
    this.options = options;
    this.tempShellFileName = 'tempShell';
    this.tempShellFilePath = path.resolve(this.options.pathConfig.appBuild, this.tempShellFileName + '.js');
  }

  build() {
    const { pathConfig } = this.options;
    const webpackShellConfig = getWebpackNodeConfig(pathConfig);
    webpackShellConfig.entry[this.tempShellFileName] = pathConfig.appShell;
    webpack(webpackShellConfig).run();
  }

  getContent() {
    const content = renderer.renderToString(
      createElement(_.interopRequire(require(this.tempShellFilePath)), {
        Component: () => createElement('div', { id: 'root-page' })
      })
    );
    // remove cache
    purgeRequireCache(this.tempShellFilePath);
    return content;
  }

  clearTempFile() {
    fs.unlinkSync(this.tempShellFilePath);
  }
}

module.exports = AppShellHandler;