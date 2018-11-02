/**
 * ast node traverse by DFS
 * @param ast
 * @param {Function} iterator
 */
module.exports = function traverse(ast, iterator) {
  if (Array.isArray(ast.children)) {
    for (let i = 0, l = ast.children.length; i < l; i++) {
      traverse(ast.children[i], iterator);
    }
  }
  iterator(ast);
};
