'use strict';
const path = require('path');
const { getWebBase } = require('rax-plugin-app');
const getEntries = require('./getEntries');
const babelConfig = require('./babel.config');

// Can‘t clone webpack chain object, so generate a new chain and reset config
module.exports = (context) => {
  const { rootDir } = context;
  const config = getWebBase(context);

  config.entryPoints.clear();

  const entries = getEntries(config, context);
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

  config.plugins.delete('document');
  config.plugins.delete('PWAAppShell');

  config.plugins.delete('minicss');
  config.module.rules.delete('css');

  const buildConfigPath = path.resolve(rootDir, 'build.json');
  const buildConfig = require(buildConfigPath);

  if (buildConfig.inlineStyle) {
    babelConfig.plugins.push(require.resolve('babel-plugin-transform-jsx-stylesheet'));

    config.module.rules.delete('jsx');
    config.module.rule('jsx')
    .test(/\.(js|mjs|jsx)$/)
    .exclude
      .add(/(node_modules|bower_components)/)
      .end()
    .use('babel')
      .loader(require.resolve('babel-loader'))
      .options(babelConfig);

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
