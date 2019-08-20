'use strict';
module.exports = (config) => {
  const allEntries = config.entryPoints.entries();
  for (const entryName in allEntries) {
    // remove hmrClient
    let entryArr = config.toConfig().entry[entryName].slice(1);
    config.entry(entryName).clear();
    config.entry(entryName).merge(entryArr);
  }

  return config;
};
