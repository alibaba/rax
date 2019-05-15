const t = require('@babel/types');

/**
 * Judge a NodePath is a Rax JSX function component.
 * @param path {NodePath}
 * eg:
 *  1. function foo(props) {
 *    return (<view></view>);
 *  }
 *  2. const foo = function(props) {
 *    return  (view></view>)
 *  }
 *  3. const foo = (props) => (<view></view>)
 */
module.exports = function isFunctionComponent(path) {
  if (!path) return false;

  const { node, scope } = path;
  if (t.isIdentifier(node)) {
    const binding = scope.getBinding(node.name);
    if (t.isVariableDeclarator(binding.path.node)) {
      return isFunctionComponent(binding.path.get('init'));
    } else {
      return isFunctionComponent(binding.path);
    }
  } else if (node == null) {
    return false;
  } else {
    return t.isFunction(node);
  }
};
