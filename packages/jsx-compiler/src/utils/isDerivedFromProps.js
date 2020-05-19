const t = require('@babel/types');

/**
 * Judge whether a variable is derived from props
 * @param scope
 * @param bindingName
 */
module.exports = function isDerivedFromProps(scope, bindingName) {
  const binding = scope.getBinding(bindingName);
  if (binding && binding.path.isVariableDeclarator()) {
    const init = binding.path.get('init');
    if (init.isMemberExpression()) {
      const { object, property } = init.node;
      if (t.isThisExpression(object) && t.isIdentifier(property, { name: 'props' })) {
        return true;
      }
    }
    if (init.isIdentifier()) {
      if (init.node.name === 'props') {
        return true;
      }
      return isDerivedFromProps(scope, init.node.name);
    }
  }
  return false;
};
