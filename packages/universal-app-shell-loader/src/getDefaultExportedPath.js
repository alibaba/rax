const traverse = require('./traverse');

/**
 * Get default exported path.
 * @param ast
 */
module.exports = function getDefaultExportedPath(ast) {
  let exportedDeclaration = null;
  traverse(ast, {
    ExportDefaultDeclaration(path) {
      exportedDeclaration = path.get('declaration');
    },
  });
  return exportedDeclaration;
};
