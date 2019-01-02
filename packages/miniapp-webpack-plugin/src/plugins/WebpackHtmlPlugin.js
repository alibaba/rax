const axios = require('axios');
const ejs = require('ejs');

const { getMaster, getMasterView, FRAMEWORK_VERSION } = require('../utils/getFrameworkCDNUrl');

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

  apply(compiler) {
    compiler.hooks.emit.tapAsync('WebpackHtmlPlugin', (compilation, callback) => {
      const {
        target,
        appConfig
      } = this.options;

      const compilationHash = compilation.hash;
      const webpackPublicPath = compilation.mainTemplate.getPublicPath({hash: compilationHash});
      const publicPath = webpackPublicPath.trim() !== '' ? webpackPublicPath : '/';

      appConfig.h5Assets = `${publicPath}app.${target}.js`;

      const frameworkVersion = appConfig.frameworkVersion || FRAMEWORK_VERSION;
      const masterPath = getMaster(frameworkVersion, target);
      const masterViewPath = getMasterView(frameworkVersion, target);

      const hasExternalApi = target === 'web' && appConfig.externalApi;
      const externalApiScript = hasExternalApi ? `<script src="${publicPath}api.js"></script>` : '';

      axios(masterViewPath)
        .then((response) => {
          const template = response.data;

          const content = ejs.render(template, {
            appConfig: JSON.stringify(appConfig, null, 2),
            h5Master: masterPath,
            externalApi: externalApiScript
          });

          const finalOutputName = 'index.html';

          compilation.assets[finalOutputName] = {
            source: () => content,
            size: () => content.length
          };
          callback();
        })
        .catch((e) => {
          console.error(e);
          throw new Error('HtmlWebpackPlugin: could not load file ' + masterViewPath);
        });
    });
  }
};