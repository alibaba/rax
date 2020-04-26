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

function injectRenderPropsEmitter(emitterName, dependencyDataArguments) {
  const emitRenderPropsUpdate = t.memberExpression(
    t.thisExpression(),
    t.identifier('_emitRenderPropsUpdate')
  );
  const callEmitRenderPropsUpdate = t.expressionStatement(t.callExpression(emitRenderPropsUpdate, [t.stringLiteral(emitterName), ...dependencyDataArguments]));
  return callEmitRenderPropsUpdate;
}

function transformRenderPropsFunction(ast, renderFunctionPath, code) {
  const renderPropsList = [];
  const renderPropsFunctions = [];
  let renderPropsEmitter = null;
  let renderPropsListener = null;
  let tempId = 0;
  traverse(ast, {
    CallExpression: {
      enter(path) {
        const { node } = path;
        const { callee } = node;
        // Handle render props
        if (t.isIdentifier(callee) && callee.name.startsWith('render') && isDerivedFromProps(renderFunctionPath.scope, callee.name)) {
          if (!path.parentPath.isJSXExpressionContainer()) {
            throw new CodeError(code, node, node.loc, 'render props can only be used in JSX expression container');
          }
          const renderPropsFuncName = /^render(\w+)/.exec(callee.name)[1].toLowerCase();
          path.parentPath.replaceWith(createJSX('slot', {
            name: t.stringLiteral(renderPropsFuncName)
          }));
          renderPropsEmitter = injectRenderPropsEmitter(callee.name, node.arguments);
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
          if (isRenderPropsAttr(attrName)) {
            const renderPropsAttrName = /^render(\w+)/.exec(attrName)[1].toLowerCase();
            if (!t.isJSXExpressionContainer(value)) {
              throw new CodeError(code, node, node.loc, 'props that start with \'render\' can only pass a JSX expression which contains a JSX element');
            }
            const expression = value.expression;
            if (t.isArrowFunctionExpression(expression)) {
              const tempDataName = `${attrName}State__temp${tempId++}`;
              const templateName = t.stringLiteral(attrName);
              const returnStatementPath = getReturnElementPath(expression) || path.get('value.expression.body');
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
                  t.identifier(attrName + 'Closure'),
                  [t.memberExpression(t.thisExpression(), t.identifier(`_${attrName}`))]
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
                      identifierNode.__renderClosureFunction = callRenderClsoureFunction;
                    }
                  }
                });
                renderPropsList.push(createJSX('template', {
                  name: templateName
                }, [returnArgumentPath.node]));
                // Return used variables
                returnArgumentPath.replaceWith(t.objectExpression(returnProperties));
                // Generate render closure function
                const renderClosureFunction = t.variableDeclaration('const', [
                  t.variableDeclarator(
                    t.identifier(attrName + 'Closure'),
                    expression
                  )
                ]);
                renderPropsListener = injectRenderPropsListener(attrName, renderClosureFunction);
                path.get('value.expression').replaceWith(callRenderClsoureFunction);
              }
              // Collect renderXXX();
              renderPropsFunctions.push({
                name: tempDataName,
                originName: attrName,
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
                slot: t.stringLiteral(renderPropsAttrName)
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
};
