const t = require('@babel/types');
const { default: traverse, NodePath } = require('@babel/traverse');

/**
 * Find reutrn statement element.
 * @param path {NodePath}
 * @return {NodePath}
 */
function findReturnElement(path) {
  let result = null;

  const plugin = {
    ReturnStatement: {
      exit(returnStatementPath) {
        result = returnStatementPath.get('argument');
      }
    },
  };
  if (path instanceof NodePath) {
    path.traverse(plugin);
  } else {
    traverse(t.file(t.program([path])), plugin);
  }

  return result;
}


module.exports = findReturnElement;
