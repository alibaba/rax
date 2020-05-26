const traverse = require('./traverseNodePath');
const t = require('@babel/types');

module.exports = function getListItem(ast) {
  let listItem = null;
  if (t.isIdentifier(ast)) {
    if (ast.__listItem) {
      return ast;
    }
    return null;
  }
  // List item has been replaced in list module
  traverse(ast, {
    Identifier(path) {
      const { node } = path;
      if (node.__listItem) {
        listItem = node;
      }
    }
  });
  return listItem;
};
