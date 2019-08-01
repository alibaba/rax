const path = require('path');
const fs = require('fs-extra');

module.exports = (rootDir, isWeb) => {
  const appDirectory = rootDir;
  const appSrc = path.resolve(appDirectory, 'src');

  const entries = {};

  const files = fs.readdirSync(path.resolve(appSrc, 'pages'));
  files.map((file) => {
    const absolutePath = path.resolve(appSrc, 'pages', file);
    const pathStat = fs.statSync(absolutePath);

    if (pathStat.isDirectory()) {
      const relativePath = path.relative(appDirectory, absolutePath);
      entries[file] = './' + path.join(relativePath, '/');
    }
  });

  const documentPath = path.resolve(appSrc, 'document/index.jsx');
  if (fs.existsSync(documentPath) && !isWeb) {
    entries._document = documentPath;
  }

  const shellPath = path.resolve(appSrc, 'shell/index.jsx');
  if (fs.existsSync(shellPath)) {
    entries._shell = shellPath;
  }

  return entries;
};
