const { resolve } = require('path');
const { readFileSync, existsSync } = require('fs');
const address = require('address');
const ejs = require('ejs');

const { version: atagVersion } = require('atag/package.json');
const getFrameworkVersion = require('../utils/getFrameworkVersion');

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
    const {
      appConfig
    } = this.options;

    if (appConfig.frameworkVersion) {
      return new Promise(resolve => {
        resolve(appConfig.frameworkVersion);
      });
    }

    return getFrameworkVersion();
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

      // const localIP = address.ip();
      const localIP = '0.0.0.0'

      const options = {
        appConfig: JSON.stringify(appConfig, null, 2),
        externalApi: externalApiScript,
        isDebug: process.env.DEBUG,
        atagVersion,
        debugFrameworkURL: `http://${localIP}:9002/miniapp-framework-web.js`
      };

      const finalOutputName = 'index.html';

      this.getFrameworkVersion().then((frameworkVersion) => {
        options.frameworkVersion = frameworkVersion;

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
