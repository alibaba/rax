const WebpackAssetsPlugin = require('./plugins/WebpackAssetsPlugin');
const WebpackHtmlPlugin = require('./plugins/WebpackHtmlPlugin');
const WebpackWrapPlugin = require('./plugins/WebpackWrapPlugin');
const WebpackExternalApiPlugin = require('./plugins/WebpackExternalApiPlugin');

const BabelPluginRootImport = require('./plugins/BabelPluginRootImport');
const PostcssPluginRpx2rem = require('./plugins/PostcssPluginRpx2rem');
const PostcssPluginTagPrefix = require('./plugins/PostcssPluginTagPrefix');

const LocalAssetLoader = require('./loaders/LocalAssetLoader');
const styleResolver = require('./utils/styleResolver');

class MiniAppWebpackPlugin {
  constructor(opts = {}) {
    this.options = Object.assign({
      target: 'web'
    }, opts)
  }

  apply(compiler) {
    const {
      target
    } = this.options;
    
    compiler.apply(new WebpackAssetsPlugin());

    if (target === 'web' || target === 'ide') {
      compiler.apply(new WebpackHtmlPlugin());
    }

    if (target === 'web') {
      compiler.apply(new WebpackExternalApiPlugin());
    }
  }
};

module.exports = {
  MiniAppWebpackPlugin,
  BabelPluginRootImport,
  PostcssPluginRpx2rem,
  PostcssPluginTagPrefix,
  LocalAssetLoader,
  styleResolver
}