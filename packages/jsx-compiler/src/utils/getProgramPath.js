const traverse = require('./traverseNodePath');

/**
 * Get program path.
 * @param ast
 */
module.exports = function getProgramPath(ast) {
  let programPath = null;
  traverse(ast, {
    Program(path) {
      programPath = path;
    },
  });
  return programPath;
};
