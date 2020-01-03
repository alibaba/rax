const traverse = require('./traverseNodePath');

module.exports = function(ast) {
  let isSlotScopeNode = false;
  traverse(ast, {
    Identifier(innerPath) {
      if (innerPath.node.__slotScope) {
        isSlotScopeNode = true;
      }
    }
  });
  return isSlotScopeNode;
};
