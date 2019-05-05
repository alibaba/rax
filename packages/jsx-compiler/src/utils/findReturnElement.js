const t = require('_@babel_types@7.1.3@@babel/types/lib/index');
const { default: traverse, NodePath } = require('_@babel_traverse@7.1.4@@babel/traverse');

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
    // Wrap a file > program to statement.
    traverse(t.file(t.program([path])), plugin);
  }

  return result;
}

module.exports = findReturnElement;
