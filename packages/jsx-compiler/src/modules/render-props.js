const t = require('@babel/types');
const traverse = require('../utils/traverseNodePath');
const getReturnElementPath = require('../utils/getReturnElementPath');
const createJSX = require('../utils/createJSX');
const createBinding = require('../utils/createBinding');
const isDerivedFromProps = require('../utils/isDerivedFromProps');
const { isRenderPropsAttr } = require('../utils/checkAttr');
const CodeError = require('../utils/CodeError');

const renderPropsMap = new Map();

function injectRenderPropsListener(listenerName, renderClosureFunction) {
  const onRenderPropsUpdate = t.memberExpression(
    t.thisExpression(),
    t.identifier('_onRenderPropsUpdate')
  );
  // listener
  const callOnRenderPropsUpdate = t.expressionStatement(
    t.callExpression(
      onRenderPropsUpdate,
      [t.stringLiteral(listenerName), t.arrowFunctionExpression([t.identifier('e')], t.blockStatement([
        t.expressionStatement(
          t.assignmentExpression('=',
            t.memberExpression(
              t.thisExpression(),
              t.identifier(`_${listenerName}`)
            ),
            t.identifier('e')
          )
        )
      ]))]
    )
  );
  return [renderClosureFunction, callOnRenderPropsUpdate];
}

function injectRenderPropsEmitter(originalEmitterName, dependencyDataArguments) {
  const emitRenderPropsUpdate = t.memberExpression(
    t.thisExpression(),
    t.identifier('_emitRenderPropsUpdate')
  );
  const callEmitRenderPropsUpdate = t.expressionStatement(t.callExpression(emitRenderPropsUpdate, [t.stringLiteral(originalEmitterName), ...dependencyDataArguments]));
  return callEmitRenderPropsUpdate;
}

function transformRenderPropsFunction(ast, renderFunctionPath, code) {
  const renderPropsList = [];
  const renderPropsFunctions = [];
  let renderPropsEmitter = [];
  let renderPropsListener = [];
  let tempId = 0;
  let renderPropsId = 0;
  traverse(ast, {
    CallExpression: {
      enter(path) {
        const { node } = path;
        const { callee } = node;
        // Handle render props
        // e.g. this.props.renderCat()
        if (t.isIdentifier(callee) && callee.name.startsWith('render') && isDerivedFromProps(renderFunctionPath.scope, callee.name)) {
          if (!path.parentPath.isJSXExpressionContainer()) {
            throw new CodeError(code, node, node.loc, 'render props can only be used in JSX expression container');
          }
          let componentName;
          let componentDeclarationNode;
          const renderFnParentPath = renderFunctionPath.parentPath;
          if (renderFnParentPath.isClassBody()) {
            // Class component
            componentName = renderFnParentPath.parentPath.get('id') && renderFnParentPath.parentPath.get('id').node.name;
            componentDeclarationNode = renderFnParentPath.parentPath.node;
          } else {
            // Function component
            componentName = renderFunctionPath.get('id') && renderFunctionPath.get('id').node.name;
            componentDeclarationNode = renderFunctionPath.node;
          }
          if (!componentName) {
            throw new CodeError(code, componentDeclarationNode, componentDeclarationNode.loc, 'Component which contains render props must have a specific name');
          }
          const renderPropsName = renderPropsMap.get(`${componentName}_${callee.name}`);
          const renderPropsSlotName = /^render(\w+)/.exec(callee.name)[1].toLowerCase();
          path.parentPath.replaceWith(createJSX('slot', {
            name: t.stringLiteral(renderPropsSlotName)
          }));
          renderPropsEmitter.push(injectRenderPropsEmitter(renderPropsName, node.arguments));
        }
      }
    },
    JSXAttribute: {
      enter(path) {
        const { node } = path;
        const { name, value } = node;
        const attrName = name.name;
        const JSXElementPath = path.parentPath.parentPath;
        if (t.isJSXIdentifier(name) && JSXElementPath.isJSXElement()) {
          const componentName = JSXElementPath.node.openingElement.name.name;
          // <ComponentA renderCat={xxx}></ComponentA>
          if (isRenderPropsAttr(attrName)) {
            const renderPropsSlotName = /^render(\w+)/.exec(attrName)[1].toLowerCase();
            const renderPropsAttrName = attrName + renderPropsId++;
            if (!t.isJSXExpressionContainer(value)) {
              throw new CodeError(code, node, node.loc, 'props that start with \'render\' can only pass a JSX expression which contains a JSX element');
            }
            const expression = value.expression;
            let renderItemFunctionPath;
            // renderXXX={() => ({<View></View>})}
            if (t.isArrowFunctionExpression(expression)) {
              renderItemFunctionPath = path.get('value.expression');
            } else if (t.isMemberExpression(expression) && t.isThisExpression(expression.object) && t.isIdentifier(expression.property)) {
              // In class component, renderXXX={this.renderXXX}
              const renderFnParentPath = renderFunctionPath.parentPath;
              if (!renderFnParentPath.isClassBody()) {
                throw new CodeError(code, node, node.loc, `'this.${expression.property.name}' can only be used in class component`);
              }
              const methodName = expression.property.name;
              if (!methodName.startsWith('render')) {
                throw new CodeError(code, node, node.loc, `'this.${expression.property.name}' function name should start with 'render'`);
              }
              throw new CodeError(code, node, node.loc, `'this.${expression.property.name}' is not supported temporarily with render props in class component, please use anonymous arrow function instead`);
            } else if (t.isIdentifier(expression)) {
              // In function component, renderXXX={renderXXX}
              if (renderFunctionPath.parentPath.isClassBody()) {
                throw new CodeError(code, node, node.loc, `'${expression.name}' can only be used in function component`);
              }
              if (!expression.name.startsWith('render')) {
                throw new CodeError(code, node, node.loc, `'${expression.name}' function name should start with 'render'`);
              }
              const methodName = expression.name;
              const functionComponentBody = renderFunctionPath.get('body.body');
              const declaratedRenderFunctionPath = functionComponentBody.find(path => path.isFunctionDeclaration() && path.node.id.name === methodName);
              if (declaratedRenderFunctionPath) {
                throw new CodeError(code, declaratedRenderFunctionPath.node, declaratedRenderFunctionPath.node.loc, 'render funtions that used in render props can not be declared temporarily, please use variable declaration instead');
              }
              const variableDeclarationPath = functionComponentBody.find(path => {
                return path.isVariableDeclaration() && path.get('declarations').find(innerPath => innerPath.isVariableDeclarator() && innerPath.node.id.name === methodName);
              });
              const variableDeclarator = variableDeclarationPath.get('declarations').find(path => path.isVariableDeclarator() && path.node.id.name === methodName);
              renderItemFunctionPath = variableDeclarator.get('init');
            }
            if (renderItemFunctionPath) {
              const renderItemFunctionNode = renderItemFunctionPath.node;
              if (renderItemFunctionNode.params.length > 1) {
                throw new CodeError(code, renderItemFunctionNode, renderItemFunctionNode.loc, 'render funtions that used in render props can only accept one param at most temporarily');
              }
              const tempDataName = `${attrName}State__temp${tempId++}`;
              const templateName = t.stringLiteral(renderPropsAttrName);
              const returnStatementPath = getReturnElementPath(renderItemFunctionNode) || path.get('value.expression.body');
              if (!returnStatementPath) return;

              let returnArgumentPath;
              if (returnStatementPath.isReturnStatement()) {
                returnArgumentPath = returnStatementPath.get('argument');
              } else {
                returnArgumentPath = returnStatementPath;
              }

              if (!renderPropsFunctions.some(fn => fn.originName === attrName)) {
                if (!returnArgumentPath.isJSXElement()) {
                  path.skip();
                  return;
                }
                // Replace the expression with render closure function
                const callRenderClsoureFunction = t.callExpression(
                  t.identifier(renderPropsAttrName + 'Closure'),
                  [t.memberExpression(t.thisExpression(), t.identifier(`_${renderPropsAttrName}`))]
                );
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
                      identifierNode.__renderClosureFunction = t.memberExpression(callRenderClsoureFunction, t.identifier(identifierNode.name));
                    }
                  }
                });
                renderPropsList.push(createJSX('template', {
                  name: templateName
                }, [returnArgumentPath.node]));
                // Return used variables
                returnArgumentPath.replaceWith(t.objectExpression(returnProperties));
                // Generate render closure function
                let renderClosureFunction;
                if (renderItemFunctionPath.isClassMethod()) {
                  renderClosureFunction = t.variableDeclaration('const', [
                    t.variableDeclarator(
                      t.identifier(renderPropsAttrName + 'Closure'),
                      t.arrowFunctionExpression(renderItemFunctionNode.params, renderItemFunctionNode.body, false)
                    )
                  ]);
                } else {
                  renderClosureFunction = t.variableDeclaration('const', [
                    t.variableDeclarator(
                      t.identifier(renderPropsAttrName + 'Closure'),
                      renderItemFunctionNode
                    )
                  ]);
                }
                renderPropsListener.push(injectRenderPropsListener(renderPropsAttrName, renderClosureFunction));
                renderPropsMap.set(`${componentName}_${attrName}`, renderPropsAttrName);
                path.get('value.expression').replaceWith(callRenderClsoureFunction);
              }
              // Collect renderXXX();
              renderPropsFunctions.push({
                name: tempDataName,
                originName: renderPropsAttrName,
                node: path.get('value.expression').node
              });

              if (!JSXElementPath.node.closingElement) {
                JSXElementPath.node.openingElement.selfClosing = false;
                JSXElementPath.get('closingElement').replaceWith(t.jsxClosingElement(t.jsxIdentifier(componentName)));
              }
              const templateJSX = createJSX('template', {
                is: templateName,
                data: t.stringLiteral(createBinding(`...${tempDataName}, __tagId: __tagId`))
              });
              const slotJSX = createJSX('view', {
                slot: t.stringLiteral(renderPropsSlotName)
              }, [templateJSX]);
              JSXElementPath.node.children = [slotJSX, ...JSXElementPath.node.children];
              path.remove();
            }
          }
        }
      },
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
            path.node.children = [...renderPropsList, ...path.node.children];
          } else {
            path.skip();
          }
        } else {
          path.skip();
        }
      }
    },
  });
  return { renderPropsListener, renderPropsEmitter, renderPropsFunctions };
}

module.exports = {
  parse(parsed, code, options) {
    const { renderPropsListener, renderPropsEmitter, renderPropsFunctions } = transformRenderPropsFunction(parsed.templateAST, parsed.renderFunctionPath, code);
    parsed.renderPropsFunctions = renderPropsFunctions;
    parsed.renderPropsListener = renderPropsListener;
    parsed.renderPropsEmitter = renderPropsEmitter;
  },

  // For test cases.
  _transformRenderPropsFunction: transformRenderPropsFunction,
  _renderPropsMap: renderPropsMap
};
