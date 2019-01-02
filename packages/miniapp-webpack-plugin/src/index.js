const path = require('path');

const WebpackAssetsPlugin = require('./plugins/WebpackAssetsPlugin');
const WebpackHtmlPlugin = require('./plugins/WebpackHtmlPlugin');
const WebpackExternalApiPlugin = require('./plugins/WebpackExternalApiPlugin');

const PostcssPluginRpx2rem = require('./plugins/PostcssPluginRpx2rem');
const PostcssPluginTagPrefix = require('./plugins/PostcssPluginTagPrefix');
const styleResolver = require('./utils/styleResolver');

const { getAppConfig } = require('./utils/getAppConfig');

class MiniAppWebpackPlugin {
  constructor(opts = {}) {
    this.options = Object.assign({
      target: 'web'
    }, opts);
  }

  apply(compiler) {
    const projectDir = compiler.context;
    const appConfig = getAppConfig(projectDir);

    const {
      target
    } = this.options;

    compiler.apply(new WebpackAssetsPlugin({
      target
    }));

    if (target === 'web' || target === 'ide') {
      compiler.apply(new WebpackHtmlPlugin({
        target,
        appConfig
      }));
    }

    if (target === 'web' && appConfig.externalApi) {
      const apiPath = path.resolve(projectDir, appConfig.externalApi);
      compiler.apply(new WebpackExternalApiPlugin({
        api: apiPath
      }));
    }
  }
};

module.exports = {
  MiniAppWebpackPlugin,
  PostcssPluginRpx2rem,
  PostcssPluginTagPrefix,
  styleResolver
};