'use strict';

const { setWebBuild } = require('rax-plugin-app');

const getEntries = require('../getEntries');

module.exports = (config, rootDir) => {
  setWebBuild(config, rootDir);

  const entries = getEntries(rootDir);

  config.entryPoints.clear();

  Object.keys(entries).forEach((key) => {
    config.entry(key)
      .add(entries[key]);
  });

  config.optimization
    .clear()
    .minimize(false);
};
