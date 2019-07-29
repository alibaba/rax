const traverse = require('./traverseNodePath');

/**
 * Set dynamic value in directive list (exclude args and iterator value)
 * @param path
 * @param ast
 * @param dynamicValue
 */
function setValueInDirectiveList(path, ast, dynamicValue) {
  const elThatContainSkipIds = path.findParent(p => p.isJSXElement() && p.node.skipIds);
  const skipIds = elThatContainSkipIds
    && elThatContainSkipIds.node
    && elThatContainSkipIds.node.skipIds;

  traverse(ast, {
    Identifier(idPath) {
      const isArgsOfDirectiveList = skipIds && skipIds.has(idPath.node.name);
      const parentMem = idPath.findParent(p => p.isMemberExpression());
      if (parentMem && parentMem.node.object === idPath.node) {
        if (!isArgsOfDirectiveList) {
          dynamicValue[idPath.node.name] = idPath.node;
        }
      } else if (!parentMem && !isArgsOfDirectiveList) {
        dynamicValue[idPath.node.name] = idPath.node;
      }
    },
  });
}

module.exports = {
  setValueInDirectiveList: setValueInDirectiveList
};
