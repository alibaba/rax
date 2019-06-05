const fs = require('fs');
const path = require('path');
const pathConfig = require('../config/path.config');

module.exports = () => {
  const appDirectory = pathConfig.appDirectory;
  const appSrc = pathConfig.appSrc;

  const entries = {};

  const files = fs.readdirSync(path.join(appSrc, 'pages'));
  files.map((file) => {
    const absolutePath = path.join(appSrc, 'pages', file);
    const pathStat = fs.statSync(absolutePath);

    if (pathStat.isDirectory()) {
      const relativePath = path.relative(appDirectory, absolutePath);
      entries[file] = './' + path.join(relativePath, 'index.jsx');
    }
  });

  const documentPath = pathConfig.appDocument;
  if (fs.existsSync(documentPath)) {
    entries._document = documentPath;
  }

  const shellPath = pathConfig.appShell;
  if (fs.existsSync(shellPath)) {
    entries._shell = shellPath;
  }

  return entries;
};