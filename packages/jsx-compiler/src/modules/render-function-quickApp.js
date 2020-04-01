const t = require('@babel/types');
const traverse = require('../utils/traverseNodePath');
const getReturnElementPath = require('../utils/getReturnElementPath');
const createJSX = require('../utils/createJSX');
const genExpression = require('../codegen/genExpression');
const { parseCode } = require('../parser/index');
const createBinding = require('../utils/createBinding');

function transformRenderFunction(ast, renderFnPath, code, options) {
  const renderItemList = [];
  const renderItemFunctions = [];
  const importComponents = [];
  const renderItem = {};
  let tempId = 0;
  traverse(ast, {
    CallExpression: {
      enter(path) {
        const { node } = path;
        const renderFnParentPath = renderFnPath.parentPath;
        const returnProperties = [];
        // Class component
        if (renderFnParentPath.isClassBody()) {
          const callee = node.callee;
          // Handle this.xxxx()
          if (t.isThisExpression(callee.object) && t.isIdentifier(callee.property)) {
            const methodName = callee.property.name;
            const tempDataName = `${methodName}StateTemp${tempId++}`;
            // const templateName = t.stringLiteral(methodName);
            const renderFunctionPath = renderFnParentPath.get('body').find(path => path.isClassMethod()
              && path.node.key.name === methodName);
            const returnStatementPath = getReturnElementPath(renderFunctionPath);
            const returnArgumentPath = returnStatementPath.get('argument');
            if (!renderItemFunctions.some(fn => fn.originName === methodName)) {
              if (!returnArgumentPath.isJSXElement()) {
                path.skip();
                return;
              }
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
              // collect template tagName
              renderItem[ methodName ] = returnArgumentPath.node;
              renderItemList.push(renderItem);
              // Return used variables
              returnArgumentPath.replaceWith(t.objectExpression(returnProperties));
            }

            // Collect this.xxxx()
            renderItemFunctions.push({
              name: tempDataName,
              originName: methodName,
              node,
            });
            const targetNode = renderItem[ methodName ];
            targetNode.__renderParams = {
              tempDataName,
              objectExpression: returnArgumentPath.node
            };

            const targetAttr = {};
            returnProperties.forEach((v) => {
              targetAttr[v.key.name] = t.stringLiteral(createBinding(`${tempDataName}.${v.value.name}`));
            });
            const targetPath = path.parentPath.isJSXExpressionContainer() ? path.parentPath : path;
            targetNode && targetPath.replaceWith(targetNode);
          }
        }
      }
    }
  });
  return { renderItemFunctions, renderItemList, importComponents };
}

module.exports = {
  parse(parsed, code, options) {
    if (!options.adapter.singleFileComponent) return;
    const { renderItemFunctions, renderItemList, importComponents } = transformRenderFunction(parsed.templateAST, parsed.renderFunctionPath, code, options);
    parsed.renderItemFunctions = renderItemFunctions;
    parsed.renderItems = renderItemList;
    parsed.importComponents = importComponents;
  },
  generate(ret, parsed, options) {
    if (!options.adapter.singleFileComponent) return;
    ret.renderItems = parsed.renderItems;
    ret.importComponents = parsed.importComponents;
  },
  // For test cases.
  _transformRenderFunction: transformRenderFunction,
};
