const path = require('path');

module.exports = {
  getTemplateImportPath(targetPath, outputPath) {
    return `<import src="${path.relative(path.dirname(targetPath), outputPath)}" />`;
  },
};
