const fs = require('fs');
const path = require('path');

const getPagesConfig = (appConfig, pathConfig) => {
  const pagesConfig = {};
  fs.readdirSync(path.join(pathConfig.appSrc, 'pages')).map((file) => {
    if (fs.statSync(path.join(pathConfig.appSrc, 'pages', file)).isDirectory()) {
      pagesConfig[file] = { path: `/${file}`, ...appConfig.pages[file] };
    }
  });
  return pagesConfig;
}

module.exports = getPagesConfig