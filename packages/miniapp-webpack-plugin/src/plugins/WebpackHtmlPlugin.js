const { resolve } = require('path');
const { readFileSync, existsSync } = require('fs');
const address = require('address');
const ejs = require('ejs');

const getFrameworkVersion = require('../utils/getFrameworkVersion');

const NATIVE_FRAMEWORK_NAME = 'miniapp-framework';
const WEB_FRAMEWORK_NAME = 'miniapp-framework-web';
const IDE_FRAMEWORK_NAME = 'miniapp-framework-ide';

/**
 * 基于 framework 中的 view 生成 html 页面
 */
module.exports = class WebpackHtmlPlugin {
  constructor(options) {
    this.options = Object.assign({
      target: 'web',
      appConfig: {}
    }, options);
  }

  getFrameworkVersion() {
    const { appConfig, target } = this.options;

    switch (target) {
      case 'web': {
        return appConfig.frameworkWebVersion
          ? Promise.resolve(appConfig.frameworkWebVersion)
          : getFrameworkVersion(WEB_FRAMEWORK_NAME);
      }
      case 'ide': {
        return appConfig.frameworkIdeVersion
          ? Promise.resolve(appConfig.frameworkIdeVersion)
          : getFrameworkVersion(IDE_FRAMEWORK_NAME);
      }
      default: {
        return appConfig.frameworkVersion
          ? Promise.resolve(appConfig.frameworkVersion)
          : getFrameworkVersion(NATIVE_FRAMEWORK_NAME);
      }
    }
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('WebpackHtmlPlugin', (compilation, callback) => {
      const {
        target,
        appConfig
      } = this.options;

      const compilationHash = compilation.hash;
      const webpackPublicPath = compilation.mainTemplate.getPublicPath({hash: compilationHash});
      const publicPath = webpackPublicPath.trim() !== '' ? webpackPublicPath : '/';

      appConfig.h5Assets = `${publicPath}app.js`;

      const hasExternalApi = target === 'web' && appConfig.externalApi;
      const externalApiScript = hasExternalApi ? `<script src="${publicPath}api.js"></script>` : '';

      const templatePath = resolve(__dirname, '../utils/template.ejs');

      if (!existsSync(templatePath)) {
        throw new Error('HtmlWebpackPlugin: could not load file ' + templatePath);
      }

      const template = readFileSync(templatePath, 'utf-8');
      const localIP = address.ip();
      const finalOutputName = 'index.html';
      const frameworkName = this.options.target === 'web'
        ? WEB_FRAMEWORK_NAME
        : this.options.target === 'ide' ? IDE_FRAMEWORK_NAME : NATIVE_FRAMEWORK_NAME;

      Promise.all([
        this.getFrameworkVersion(),
        getFrameworkVersion('atag')
      ])
        .then(([frameworkVersion, atagVersion]) => {
          const options = {
            appConfig: JSON.stringify(appConfig, null, 2),
            externalApi: externalApiScript,
            isDebug: process.env.DEBUG,
            atagVersion,
            externalScripts: [
              `https://g.alicdn.com/code/npm/atag/${atagVersion}/dist/atag.js`,
              `https://g.alicdn.com/code/npm/${frameworkName}/${frameworkVersion}/dist/${frameworkName}.min.js`,
            ],
            debugFrameworkURL: `http://${localIP}:9002/miniapp-framework-web.js`
          };

          const content = ejs.render(template, options);
          compilation.assets[finalOutputName] = {
            source: () => content,
            size: () => content.length
          };

          callback();
        }).catch(e => {
          console.log(e);
          throw new Error('HtmlWebpackPlugin: generate error');
        });
    });
  }
};
