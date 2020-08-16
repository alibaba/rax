const t = require('@babel/types');
const traverse = require('../utils/traverseNodePath');
const getReturnElementPath = require('../utils/getReturnElementPath');
const createJSX = require('../utils/createJSX');
const createBinding = require('../utils/createBinding');

function transformRenderFunction(ast, renderFnPath) {
  const renderItemList = [];
  const renderItemFunctions = [];
  let tempId = 0;
  traverse(ast, {
    CallExpression: {
      enter(path) {
        const { node } = path;
        const renderFnParentPath = renderFnPath.parentPath;
        // Class component
        if (renderFnParentPath.isClassBody()) {
          const callee = node.callee;
          // Handle this.xxxx()
          if (t.isThisExpression(callee.object) && t.isIdentifier(callee.property)) {
            const methodName = callee.property.name;
            const tempDataName = `${methodName}State__temp${tempId++}`;
            const templateName = t.stringLiteral(methodName);
            const renderFunctionPath = renderFnParentPath.get('body').find(path => path.isClassMethod()
              && path.node.key.name === methodName);
            const returnStatementPath = getReturnElementPath(renderFunctionPath);
            if (!returnStatementPath) return;
            const returnArgumentPath = returnStatementPath.get('argument');
            if (!renderItemFunctions.some(fn => fn.originName === methodName)) {
              if (!returnArgumentPath.isJSXElement()) {
                path.skip();
                return;
              }
              const returnProperties = [];
              // Collect identifier in return Element
              returnStatementPath.traverse({
                Identifier(innerPath) {
                  const { node: identifierNode } = innerPath;
                  if (renderFunctionPath.scope.hasBinding(identifierNode.name)) {
                    // Avoid repeat push
                    if (!returnProperties.some(
                      pty => pty.key.name === identifierNode.name)) {
                      returnProperties.push(t.objectProperty(identifierNode, identifierNode));
                    }
                    // Tag as template variable
                    identifierNode.__templateVar = true;
                  }
                }
              });
              renderItemList.push(createJSX('template', {
                name: templateName
              }, [returnArgumentPath.node]));
              // Return used variables
              returnArgumentPath.replaceWith(t.objectExpression(returnProperties));
            }
            // Collect this.xxxx()
            renderItemFunctions.push({
              name: tempDataName,
              originName: methodName,
              node,
            });
            const targetPath = path.parentPath.isJSXExpressionContainer() ? path.parentPath : path;
            targetPath.replaceWith(createJSX('template', {
              is: templateName,
              data: t.stringLiteral(createBinding(`...${tempDataName}`))
            }), []);
          }
        } else {
          // Function component
          const callee = node.callee;
          if (t.isIdentifier(callee) && callee.name.startsWith('render')) {
            const methodName = callee.name;
            const functionComponentBody = renderFnPath.get('body.body');
            const renderFunctionPath = functionComponentBody.find(path => {
              return path.isFunctionDeclaration() && path.node.id.name === methodName ||
                path.isVariableDeclaration() && path.get('declarations').find(innerPath => innerPath.isVariableDeclarator() && innerPath.node.id.name === methodName);
            });
            if (renderFunctionPath) {
              const tempDataName = `${methodName}State__temp${tempId++}`;
              const templateName = t.stringLiteral(methodName);
              const returnStatementPath = getReturnElementPath(renderFunctionPath);
              if (!returnStatementPath) return;
              const returnArgumentPath = returnStatementPath.get('argument');
              if (!renderItemFunctions.some(fn => fn.originName === methodName)) {
                if (!returnArgumentPath.isJSXElement()) {
                  path.skip();
                  return;
                }
                const returnProperties = [];
                // Collect identifier in return Element
                returnStatementPath.traverse({
                  Identifier(innerPath) {
                    const { node: identifierNode } = innerPath;
                    if (innerPath.scope.hasBinding(identifierNode.name)) {
                      // Avoid repeat push
                      if (!returnProperties.some(
                        pty => pty.key.name === identifierNode.name)) {
                        returnProperties.push(t.objectProperty(identifierNode, identifierNode));
                      }
                      // Tag as template variable
                      identifierNode.__templateVar = true;
                    }
                  }
                });
                renderItemList.push(createJSX('template', {
                  name: templateName
                }, [returnArgumentPath.node]));
                // Return used variables
                returnArgumentPath.replaceWith(t.objectExpression(returnProperties));
              }
              // Collect renderXXX();
              renderItemFunctions.push({
                name: tempDataName,
                originName: methodName,
                node,
              });
              const targetPath = path.parentPath.isJSXExpressionContainer() ? path.parentPath : path;
              targetPath.replaceWith(createJSX('template', {
                is: templateName,
                data: t.stringLiteral(createBinding(`...${tempDataName}`))
              }), []);
            }
          }
        }
      }
    },
    JSXElement: {
      exit(path) {
        const { node: {
          openingElement
        } } = path;
        if (openingElement) {
          if (t.isJSXIdentifier(openingElement.name)
            && openingElement.name.name === 'block'
            && openingElement.attributes.find(attr => t.isStringLiteral(attr.value) && attr.value.value === '{{$ready}}')
          ) {
            // Insert template define
            path.node.children = [...renderItemList, ...path.node.children];
          } else {
            path.skip();
          }
        } else {
          path.skip();
        }
      }
    }
  });
  return renderItemFunctions;
}

module.exports = {
  parse(parsed, code, options) {
    parsed.renderItemFunctions = transformRenderFunction(parsed.templateAST, parsed.renderFunctionPath);
  },

  // For test cases.
  _transformRenderFunction: transformRenderFunction,
};
