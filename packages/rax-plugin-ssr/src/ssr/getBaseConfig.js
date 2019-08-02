'use strict';

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
    .set('@core/router', 'universal-app-runtime')
    .set('rax-server-renderer', require.resolve('rax-server-renderer'));

  config.target('node');

  config.output
    .filename('server/[name].js')
    .libraryTarget('commonjs2');

  config.externals({
    rax: 'rax',
  });

  config.plugins.delete('document');

  return config;
};
