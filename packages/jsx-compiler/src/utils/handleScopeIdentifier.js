const handleValidIdentifier = require('./handleValidIdentifier');

/**
 * Handle identifier which is in current path scope
 * @param {NodePath} path target node path
 * @param {Function} traverseCallback calls when traverse the in scope identifier
 * @param {Function} endCallback calls when all identifier is in scope and whole traverse end
 */
module.exports = function(path, traverseCallback, endCallback) {
  let executeEndCallback = true;
  path.traverse({
    Identifier(innerPath) {
      handleValidIdentifier(innerPath, () => {
        executeEndCallback = executeScopeIdentifierCallback(path, innerPath, traverseCallback);
      });
    }
  });

  if (executeEndCallback) {
    endCallback && endCallback();
  }
};

function executeScopeIdentifierCallback(path, identifierPath, traverseCallback) {
  let executeEndCallback = true;
  const node = identifierPath.node;
  // console.log(node.name, genExpression(path.node));

  if (path.scope.hasBinding(node.name)) {
    traverseCallback && traverseCallback(identifierPath);
  } else {
    executeEndCallback = false;
  }
  return executeEndCallback;
}
