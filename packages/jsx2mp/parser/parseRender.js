const { default: traverse, NodePath } = require('@babel/traverse');
const t = require('@babel/types');
const parseElement = require('./parseElement');

/**
 * parse render method
 * @param path {NodePath}
 * @return {Node}
 */
function parseRender(path) {
  let resultNode = null;
  const varMaps = {};
  const visitor = {
    VariableDeclaration(path) {
      const { declarations: {
        id,
        init
      } } = path;

      switch (id.type) {
        case 'Identifier':
          break;
      }
    },
    IfStatement(path) {
      console.log('visited if');
    },
    ReturnStatement: {
      exit(returnElementPath) {
        const { node: returnElement } = returnElementPath.get('argument');
        if (isSupportTransfrom(returnElement)) {
          // transfrom returnElement
          resultNode = parseElement(returnElement);
        } else {
          throw new Error('Render method only return JSXElement.');
        }
      }
    }
  };
  if (path instanceof NodePath) {
    path.traverse(visitor);
  } else {
    traverse(t.file(t.program([path])), visitor);
  }

  return resultNode;
}

function isSupportTransfrom(el) {
  const typeCheckMethods = [
    'isJSXElement',
    'isStringLiteral',
    'isNumericLiteral',
    'isArrayExpression'
  ];
  return typeCheckMethods.some(method => t[method](el));
}

module.exports = parseRender;
