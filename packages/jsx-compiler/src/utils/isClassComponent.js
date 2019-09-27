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
  if (t.isIdentifier(node)) {
    const binding = scope.getBinding(node.name);
    if (t.isVariableDeclarator(binding.path.node)) {
      return isClassComponent(binding.path.get('init'));
    } else {
      return isClassComponent(binding.path);
    }
  } else {
    let importModuleBinding;

    if (t.isMemberExpression(node.superClass)) {
      // Case 1
      // Step 1: judge property name is Component.
      if (!t.isIdentifier(node.superClass.property, { name: RAX_COMPONENT })) return false;

      // Step2: find `object` is import from 'rax'.
      importModuleBinding = scope.getBinding(node.superClass.object.name);
    } else if (t.isIdentifier(node.superClass)) {
      // Case 2
      importModuleBinding = scope.getBinding(node.superClass.name);
    }

    if (importModuleBinding && importModuleBinding.kind === 'module') {
      const bindingPath = importModuleBinding.path.parentPath;
      if (t.isImportDeclaration(bindingPath.node)) {
        return t.isStringLiteral(bindingPath.node.source, { value: RAX_PACKAGE });
      }
    }
    return false;
  }
};
