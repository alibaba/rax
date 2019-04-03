const { default: traverse, NodePath } = require('@babel/traverse');
const t = require('@babel/types');
const { parseElement, parserAdapter } = require('./parseElement');
const Node = require('./Node');
const { generateCodeByExpression } = require('../codegen');

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
    VariableDeclaration: {
      enter(nodePath) {
        const { node } = nodePath;
        const { declarations } = node;
        declarations.map(nodeItem => {
          const {
            id,
            init
          } = nodeItem;
          switch (id.type) {
            case 'Identifier':
              const value = init ? parseElement(init.value) : null;
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
                  varsMap[el.name] = parseElement(init.elememts[index].value);
                }
              });
              break;
          }
        });
      }
    },
    IfStatement: {
      enter(nodePath) {
        const { node } = nodePath;
        const { consequent, alternate, test, start, end } = node;
        const testValue = generateCodeByExpression(test);
        // parse consequent
        consequent.body.map(({ expression }) => {
          if (t.isAssignmentExpression(expression) && expression.operator === '=') {
            const varName = expression.left.name;
            if (!varsMap[varName].value) {
              varsMap[expression.left.name].value = new Node('block');
            }
            /**
           * Todo:
           * 1. value tranmits
           */
            let testAttrName = parserAdapter.if;
            const parentPathAlternate = nodePath.parent.alternate;
            /**
           * Condition:
           * 1. parentPath is IfStatement
           * 2. parentNode's alternate start & end is same as current path start & end
           */
            if (t.isIfStatement(nodePath.parentPath)
              && t.isIfStatement(parentPathAlternate)
              && parentPathAlternate.start === start
              && parentPathAlternate.end === end) {
              testAttrName = parserAdapter.elseif;
            }
            const rightNode = parseElement(expression.right);
            const containerNode = rightNode ? new Node('block', {
              [testAttrName]: '{{' + testValue + '}}'
            }, [rightNode]) : null;
            varsMap[varName].value.children.push(containerNode);
          }
        });
        if (!t.isIfStatement(alternate)) {
          alternate.body.map(({expression}) => {
            if (t.isAssignmentExpression(expression) && expression.operator === '=') {
              const varName = expression.left.name;
              const rightNode = parseElement(expression.right);
              if (rightNode) {
                const containerNode = new Node('block', {
                  [parserAdapter.else]: true
                }, [rightNode]);
                if (varsMap[varName].value) {
                  varsMap[varName].value.children.push(containerNode);
                } else {
                  varsMap[varName].value = containerNode;
                }
              }
            }
          });
        }
      }
    },
    ReturnStatement: {
      enter(returnElementPath) {
        const { node: returnElement } = returnElementPath.get('argument');
        if (isSupportTransfrom(returnElement)) {
          // transfrom returnElement
          // 需要替换变量的值
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
