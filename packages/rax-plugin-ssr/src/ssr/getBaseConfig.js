'use strict';
const path = require('path');
const { getWebBase } = require('rax-plugin-app');
const getEntries = require('./getEntries');

// Can‘t clone webpack chain object, so generate a new chain and reset config
module.exports = (rootDir) => {
  const config = getWebBase(rootDir);

  config.entryPoints.clear();

  const entries = getEntries(rootDir);
  Object.keys(entries).forEach((key) => {
    config.entry(key)
      .add(entries[key]);
  });

  config.resolve.alias
    .clear()
    .set('@core/app', 'universal-app-runtime')
    .set('@core/page', 'universal-app-runtime')
    .set('@core/router', 'universal-app-runtime');

  config.target('node');

  config.output
    .filename('server/[name].js')
    .libraryTarget('commonjs2');

  config.externals({
    rax: 'rax',
  });

  config.plugins.delete('document');
  config.plugins.delete('PWAAppShell');

  config.plugins.delete('minicss');
  config.module.rules.delete('css');

  const buildConfigPath = path.resolve(rootDir, 'build.json');
  const buildConfig = require(buildConfigPath);

  if (buildConfig.inlineStyle) {
    config.module.rule('css')
    .test(/\.css?$/)
    .use('css')
      .loader(require.resolve('stylesheet-loader'));
  } else {
    config.module.rule('css')
    .test(/\.css?$/)
    .use('ignorecss')
      .loader(require.resolve('./ignoreLoader'))
      .end();
  }

  return config;
};
