const t = require('@babel/types');

const RAX_PACKAGE = 'rax';
const RAX_COMPONENT = 'Component';

/**
 * Judge a NodePath is a Rax JSX class declaration.
 * @param path {NodePath}
 * eg:
 *  1. class xxx extends *.Component {}
 *  2. class xxx extends Component {}
 */
module.exports = function isClassComponent(path) {
  if (!path) return false;

  const { node, scope } = path;

  if (!node) return false;

  if (t.isIdentifier(node)) {
    const binding = scope.getBinding(node.name);
    if (t.isVariableDeclarator(binding.path.node)) {
      return isClassComponent(binding.path.get('init'));
    } else {
      return isClassComponent(binding.path);
    }
  } else {
    if (t.isMemberExpression(node.superClass)) {
      // Case 1
      // Step 1: judge property name is Component.
      if (!t.isIdentifier(node.superClass.property, { name: RAX_COMPONENT })) return false;
      // Step2: find `object` is import from 'rax'.
      const importModuleBinding = scope.getBinding(node.superClass.object.name);
      if (importModuleBinding && importModuleBinding.kind === 'module') {
        const bindingPath = importModuleBinding.path.parentPath;
        if (t.isImportDeclaration(bindingPath.node)) {
          return t.isStringLiteral(bindingPath.node.source, { value: RAX_PACKAGE });
        }
      }
    } else if (t.isIdentifier(node.superClass)) {
      // Case 2
      return path.isClassDeclaration() || path.isClassExpression();
    }

    return false;
  }
};
