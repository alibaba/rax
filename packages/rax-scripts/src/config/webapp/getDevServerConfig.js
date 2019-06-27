const path = require('path');
const pathConfig = require('../path.config');
const appConfig = require('../app.config');
const getEntries = require('../../utils/getEntries');

module.exports = function getDevServerConfig() {
  const appBuild = pathConfig.appBuild;

  const entries = getEntries();
  const pagesManifest = {};
  Object.keys(entries).map(entry => {
    pagesManifest[entry] = path.resolve(appBuild, `server/${entry}.js`);
  });

  return {
    appConfig,
    pagesManifest,
    assetsManifestPath: pathConfig.assetsManifest
  };
};