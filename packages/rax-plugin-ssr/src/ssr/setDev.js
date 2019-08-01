'use strict';

const { setWebDev } = require('rax-plugin-app');

const getEntries = require('../getEntries');

module.exports = (config, rootDir) => {
  setWebDev(config, rootDir);

  const entries = getEntries(rootDir);

  config.entryPoints.clear();

  Object.keys(entries).forEach((key) => {
    config.entry(key)
      .add(entries[key]);
  });
};
