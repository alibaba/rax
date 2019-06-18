const t = require('@babel/types');
const traverse = require('./traverseNodePath');

/**
 * Get default exported path.
 * @param ast
 */
module.exports = function getDefaultExportedPath(ast) {
  let exportedDeclaration = null;
  traverse(ast, {
    ExportDefaultDeclaration(path) {
      exportedDeclaration = path.get('declaration');
      if (t.isIdentifier(exportedDeclaration.node)) {
        const id = exportedDeclaration.node.name;
        const binding = exportedDeclaration.scope.getBinding(id);
        if (binding) {
          if (t.isVariableDeclarator(binding.path.node)) {
            exportedDeclaration = binding.path.get('init');
          } else {
            exportedDeclaration = binding.path;
          }
        } else {
          exportedDeclaration = null;
        }
      }
    },
  });
  return exportedDeclaration;
};
