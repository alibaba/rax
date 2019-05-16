const fs = require('fs');
const path = require('path');
const pathConfig = require('../config/path.config');

module.exports = () => {
  const appDirectory = pathConfig.appDirectory;
  const appSrc = pathConfig.appSrc;

  const pages = {};

  const files = fs.readdirSync(path.join(appSrc, 'pages'));
  files.map((file) => {
    const absolutePath = path.join(appSrc, 'pages', file);
    const pathStat = fs.statSync(absolutePath);

    if (pathStat.isDirectory()) {
      const relativePath = path.relative(appDirectory, absolutePath);
      pages[file] = './' + path.join(relativePath, 'index.js');
    }
  });

  return pages;
};