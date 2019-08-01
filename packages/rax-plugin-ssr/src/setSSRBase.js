'use strict';

const getEntries = require('./getEntries');

module.exports = (config, rootDir) => {
  const entries = getEntries(rootDir);

  config.entryPoints.clear();

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

  return config;
};
