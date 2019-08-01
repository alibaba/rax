'use strict';

const path = require('path');
const AssetsManifestPlugin = require('rax-pwa-webpack-plugin/lib/AssetsManifestPlugin').default;
const { RaxPWAPlugin } = require('rax-pwa-webpack-plugin');

const getEntries = require('./getEntries');

module.exports = (config, rootDir) => {
  const entries = getEntries(rootDir);

  config.entryPoints.clear();

  Object.keys(entries).forEach((key) => {
    config.entry(key)
      .add(entries[key]);
  });

  config.plugin('raxpwa')
    .use(RaxPWAPlugin, [{
      pathConfig: {
        appDirectory: rootDir,
        appSrc: path.resolve(rootDir, 'src'),
        appShell: path.resolve(rootDir, 'src/shell/index.js'),
        appDocument: path.resolve(rootDir, 'src/document/index.js'),
        appHtml: path.resolve(rootDir, 'public/index.html'),
      },
      appConfig: {
        title: 'test_title',
        pages: {
          home: {
            path: '/home',
            title: 'homePage',
          }
        },
        spa: true,
        ssr: true
      }
    }]);

  config.plugin('assetsManifest')
    .use(AssetsManifestPlugin, [{
      dist: path.resolve(rootDir, '.temp/assets_manifest.json'),
      publicPath: path.resolve(rootDir, 'public')
    }]);

  return config;
};
