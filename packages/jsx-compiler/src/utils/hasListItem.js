const traverse = require('./traverseNodePath');

module.exports = function hasListItem(ast) {
  let hasListItem = false;
  // List item has been replaced in list module
  traverse(ast, {
    Identifier(innerPath) {
      if (innerPath.node.__listItem) {
        hasListItem = true;
        innerPath.stop();
      }
    }
  });
  return hasListItem;
};
