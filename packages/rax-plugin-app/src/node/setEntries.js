const path = require('path');

module.exports = (config) => {
  const appDirectory = process.cwd();
  const appSrc = path.resolve(appDirectory, 'src');

  const entries = {};

  const files = fs.readdirSync(path.resolve(appSrc, 'pages'));
  files.map((file) => {
    const absolutePath = path.resolve(appSrc, 'pages', file);
    const pathStat = fs.statSync(absolutePath);

    if (pathStat.isDirectory()) {
      const relativePath = path.relative(appDirectory, absolutePath);
      config.entry(file)
        .add('./' + path.resolve(relativePath, '/'));
    }
  });

  const documentPath = path.resolve(appSrc, 'document/index.jsx');
  if (fs.existsSync(documentPath)) {
    config.entry('_document')
      .add(documentPath);
  }

  const shellPath = path.resolve(appSrc, 'shell/index.jsx');
  if (fs.existsSync(shellPath)) {
    config.entry('_shell')
      .add(shellPath);
  }
};
