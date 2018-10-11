const path = require('path');

module.exports = {
  /**
   * Return javascript import syntax by related path
   *
   * @param {string} targetPath Parent file path
   * @param {string} outputPath Children file path
   */
  getTemplateImportPath(targetPath, outputPath) {
    let relatedPath = path.relative(path.dirname(targetPath), outputPath);
    relatedPath = relatedPath.startsWith('.') ? relatedPath : './' + relatedPath;
    return `<import src="${relatedPath}" />`;
  },

  /**
   * Return style import syntax by related path
   *
   * @param {string} targetPath Parent file path
   * @param {string} outputPath Children file path
   */
  getStyleImportPath(targetPath, outputPath) {
    let relatedPath = path.relative(path.dirname(targetPath), outputPath);
    relatedPath = relatedPath.startsWith('.') ? relatedPath : './' + relatedPath;
    return `@import "${relatedPath}";`;
  },
};
