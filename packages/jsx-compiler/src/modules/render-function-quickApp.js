const t = require('@babel/types');
const traverse = require('../utils/traverseNodePath');
const getReturnElementPath = require('../utils/getReturnElementPath');
const createJSX = require('../utils/createJSX');
const genExpression = require('../codegen/genExpression');
const { parseCode } = require('../parser/index');
const createBinding = require('../utils/createBinding');
const isQuickApp = require('../utils/isQuickApp');

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
              // collect import tagName
              // importComponents.push(genExpression(createJSX('import', {
              //   name: templateName,
              //   src: t.stringLiteral(`./templates/${methodName}.${options.adapter.ext}`)
              // }, []), {
              //   comments: false,
              //   concise: true,
              // }))
              // collect template tagName
              renderItem[ methodName ] = returnArgumentPath.node;
              renderItemList.push(renderItem)
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
            }
            // transformTarget(targetNode, returnArgumentPath.node, tempDataName)
            
            const targetAttr = {};
            returnProperties.forEach((v) => {
              targetAttr[v.key.name] = t.stringLiteral(createBinding(`${tempDataName}.${v.value.name}`))
            })
            const targetPath = path.parentPath.isJSXExpressionContainer() ? path.parentPath : path;
            targetNode && targetPath.replaceWith(targetNode);
          }
        }
      }
    }
  });
  return { renderItemFunctions, renderItemList, importComponents };
}

function transformTarget(ast, objectExpression, tempDataName) {
  const keys = objectExpression.properties.map((v) => v.key.name);
  traverse(ast, {
    // JSXText(path) {
    //   // <View>hello</View> => <View><text>hello</text></View>
    //   const { node, parentPath } = path;
    //   if(t.isJSXElement(parentPath) && path.node.value && path.node.value.trim().length && t.isJSXIdentifier(parentPath.node.openingElement.name, { name: 'View' })) {
    //     path.replaceWith(createJSX('text', {}, [path.node]));
    //   }
    // },
    JSXExpressionContainer(path) {
      const { node, parentPath } = path;
      // if(t.isJSXElement(parentPath) && t.isJSXExpressionContainer(path) && (t.isIdentifier(node.expression) || t.isMemberExpression(node.expression)) && t.isJSXIdentifier(parentPath.node.openingElement.name, { name: 'View' })) {
      //   path.replaceWith(createJSX('text', {}, [path.node]));
      // }
      // count.xxx => `${methodName}StateTemp${tempId++}`.count.xxx
      const { expression } = node;
      const propertyName = getPropertyName(expression);
      if (t.isIdentifier(expression) && keys.some(x => x === propertyName)) {
        path.replaceWith(
          t.jSXExpressionContainer(
            t.memberExpression(
              t.identifier(tempDataName),
              expression
            )
          )
        )
      }
      if (t.isMemberExpression(expression) && keys.some(x => x === propertyName)) {
        const transExpression = parseCode(`${tempDataName}.${genExpression(expression)}`).program.body[0].expression
        path.replaceWith(t.jSXExpressionContainer(transExpression))
      }
    }
  })
}

function getPropertyName(expression) {
  if(t.isIdentifier(expression)) {
    return expression.name
  }
  if(t.isMemberExpression(expression)) {
    return getPropertyName(expression.object)
  }
}

module.exports = {
  parse(parsed, code, options) {
    const quickApp = isQuickApp(options);
    if (!quickApp) return;
    const { renderItemFunctions, renderItemList, importComponents } = transformRenderFunction(parsed.templateAST, parsed.renderFunctionPath, code, options);
    parsed.renderItemFunctions = renderItemFunctions;
    parsed.renderItems = renderItemList;
    parsed.importComponents = importComponents;
  },
  generate(ret, parsed, options) {
    const quickApp = isQuickApp(options);
    if (!quickApp) return;
    ret.renderItems = parsed.renderItems
    ret.importComponents = parsed.importComponents
  },
  // For test cases.
  _transformRenderFunction: transformRenderFunction,
};
