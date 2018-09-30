const path = require('path');

module.exports = {
  getTemplateImportPath(targetPath, outputPath) {
    let releatedPath = path.relative(path.dirname(targetPath), outputPath);
    releatedPath = releatedPath.startsWith('.') ? releatedPath : './' + releatedPath;
    return `<import src="${releatedPath}" />`;
  },

  getStyleImportPath(targetPath, outputPath) {
    let releatedPath = path.relative(path.dirname(targetPath), outputPath);
    releatedPath = releatedPath.startsWith('.') ? releatedPath : './' + releatedPath;
    return `@import "${releatedPath}";`;
  },
};
