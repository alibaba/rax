const traverse = require('./traverseNodePath');

/**
 * Get reutrn statement element.
 */
function getReturnElementPath(ast) {
  let result = null;

  traverse(ast, {
    ReturnStatement: {
      exit(returnStatementPath) {
        result = returnStatementPath;
      }
    },
  });

  return result;
}

module.exports = getReturnElementPath;
