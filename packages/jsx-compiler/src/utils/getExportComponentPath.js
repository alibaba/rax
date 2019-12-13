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
    if (programPath.scope.hasBinding(componentNode.name)) {
      programPath.traverse({
        Declaration(path) {
          const { node } = path;
          if (node.id && t.isIdentifier(node.id, {
            name: componentNode.name
          })) {
            exportComponentPath = path;
          }
        }
      });
    } else {
      throw new CodeError(code, componentNode, componentNode.loc, 'Exported component is undefined');
    }
    return exportComponentPath;
  }
};
