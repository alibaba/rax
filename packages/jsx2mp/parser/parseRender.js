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
  /**
   * varsMap
   * {
   *  a: {
   *    value: 1,
   *  },
   *  b: {
   *    source: 'state'
   *  }
   * }
   */
  const varsMap = {};
  const visitor = {
    VariableDeclaration(nodePath) {
      const { node } = nodePath;
      const { declarations } = node;
      declarations.map(nodeItem => {
        const {
          id,
          init
        } = nodeItem;
        switch (id.type) {
          case 'Identifier':
            const value = init ? init.value : null;
            varsMap[id.name] = {
              value
            };
            break;
          case 'ObjectPattern':
            id.properties.map(objProperty => {
              varsMap[objProperty.value.name] = {
                source: init.property.name
              };
            });
            break;
          case 'ArrayPattern':
            id.elememts.map((el, index) => {
              if (t.isIdentifier(el)) {
                varsMap[el.name] = init.elememts[index].value;
              }
            });
            break;
        }
      });
    },
    IfStatement(path) {
      const { node } = path;
      const { consequent, alternate, test } = node;
      consequent.body.map(({ expression }) => {
        handleAssignStatement(expression, varsMap);
      });
      if (!t.isIfStatement(alternate)) {
        alternate.body.map(({expression}) => {
          handleAssignStatement(expression, varsMap);
        });
      }
    },
    ReturnStatement: {
      enter(returnElementPath) {
        console.log(varsMap);
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

function handleAssignStatement(expression, map) {
  if (t.isAssignmentExpression(expression) && expression.operator === '=') {
    // Todo: value tranmits
    map[expression.left.name].value = expression.right;
  }
}

module.exports = parseRender;
