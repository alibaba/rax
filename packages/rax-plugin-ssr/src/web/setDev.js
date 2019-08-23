'use strict';
const { hmrClient } = require('rax-compile-config');

module.exports = (config) => {
  const allEntries = config.entryPoints.entries();
  for (const entryName in allEntries) {
    // remove hmrClient
    config.entry(entryName).delete(hmrClient);
  }

  config.devServer.delete('before');

  return config;
};
