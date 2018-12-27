const axios = require('axios');
const ejs = require('ejs');

const { getAppConfig } = require('../utils/getAppConfig');
const { getMaster, getMasterView, FRAMEWORK_VERSION } = require('../utils/getFrameworkCDNUrl');

// const HtmlWebpackPlugin = require('html-webpack-plugin');

// new HtmlWebpackPlugin({
//   inject: true,
//   template: pathConfig.appHtml,
// }),

module.exports = class WebpackHtmlPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('WebpackHtmlPlugin', (compilation, callback) => {

      const projectDir = compilation.compiler.context;

      const compilationHash = compilation.hash;
      const webpackPublicPath = compilation.mainTemplate.getPublicPath({hash: compilationHash});
      const publicPath = webpackPublicPath.trim() !== '' ? webpackPublicPath : '/';

      const pluginAssets = [];
      const appConfig = getAppConfig(projectDir, {
        pluginAssets,
      });

      const target = 'web';

      const frameworkVersion = appConfig.frameworkVersion || FRAMEWORK_VERSION;
      const masterPath = getMaster(frameworkVersion, target);
      const masterViewPath = getMasterView(frameworkVersion, target);

      const hasExternalApi = appConfig.externalApi;
      const externalApiScript = `<script src="${publicPath}api.js"></script>`;

      axios(masterViewPath)
        .then((response) => {
          const template = response.data;
          appConfig.h5Assets = `${publicPath}app.web.js`;

          const content = ejs.render(template, {
            appConfig: JSON.stringify(appConfig, null, 2),
            h5Master: masterPath,
            externalApi: hasExternalApi ? externalApiScript : ''
          });

          const finalOutputName = 'index.html';

          compilation.assets[finalOutputName] = {
            source: () => content,
            size: () => content.length
          };
          callback();
        })
        .catch((e) => {
          compilation.errors.push( new Error( 'explain why the build failed' ) )
          console.error(e);
          callback();
          return {
            content: 'ERROR',
            outputName: 'aaaa',
            hash: ''
          };
        });
    });
  }
}