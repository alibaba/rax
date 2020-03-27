const t = require('@babel/types');
const CodeError = require('../utils/CodeError');

/**
 * @param export default path
 * @param program path
 * @param source code
 * @return should be replaced path
 * */
module.exports = function(defaultExportedPath, programPath, code) {
  const exportedNodeType = defaultExportedPath.node.type;
  if (['ClassExpression', 'ClassDeclaration', 'FunctionDeclaration',
    'ArrowFunctionExpression', 'FunctionExpression' ].includes(exportedNodeType)) {
    return defaultExportedPath;
  }
  if (exportedNodeType === 'CallExpression') {
    let exportComponentPath = defaultExportedPath;
    // Only first param is component
    const componentNode = defaultExportedPath.get('arguments')[0].node;
    const componentName = componentNode.name;
    if (programPath.scope.hasBinding(componentName)) {
      programPath.traverse({
        VariableDeclarator(path) {
          const target = getComponentPath(path, componentName);
          if (target) exportComponentPath = target;
        },
        Declaration(path) {
          const target = getComponentPath(path, componentName);
          if (target) exportComponentPath = target;
        }
      });
    } else {
      throw new CodeError(code, componentNode, componentNode.loc, 'Exported component is undefined');
    }
    return exportComponentPath;
  }
};

/**
 * @param {NodePath} path - Declaration path
 * @param {string} componentName - componentName
 */
function getComponentPath(path, componentName) {
  const { node } = path;
  if (node.id && t.isIdentifier(node.id, {
    name: componentName
  })) {
    if (path.isFunctionDeclaration() || path.isClassDeclaration()) {
      return path;
    }
    return path.get('init') || path;
  }
}
