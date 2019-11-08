const t = require('@babel/types');
const traverse = require('../utils/traverseNodePath');
const getReturnElementPath = require('../utils/getReturnElementPath');
const createJSX = require('../utils/createJSX');
const genExpression = require('../codegen/genExpression');
const findIndex = require('../utils/findIndex');

function transformList(ast, renderItemFunctions, adapter) {
  let fnScope;
  let useCreateStyle = false;

  function traverseFunction(path) {
    fnScope = path.scope;
  }

  traverse(ast, {
    ArrowFunctionExpression: { enter: traverseFunction, },
    FunctionExpression: { enter: traverseFunction },
    CallExpression: {
      enter(path) {
        const { node, parentPath } = path;
        const { callee, arguments: args } = node;
        if (parentPath.parentPath.isJSXAttribute()) {
          if (t.isMemberExpression(callee) && t.isIdentifier(callee.property, { name: 'bind' })) {
            path.node.__bindEvent = true;
          }
        }
      }
    },
    exit(path) {
      const { node, parentPath } = path;
      if (node.__transformedList) return;
      node.__transformedList = true;
      const { callee, arguments: args } = node;
      const parentJSXElement = path.findParent(p => p.isJSXElement());
      if (parentJSXElement) {
        if (t.isMemberExpression(callee)) {
          if (t.isIdentifier(callee.property, { name: 'map' })) {
            /*
            * params is item & index
            * <block a:for-item="params[0]" a:for-index="params[1]" ></block>
            */
            if (t.isFunction(args[0])) {
              const { params, body } = args[0];
              // If item or index doesn't exist， set default value to params
              if (!params[0]) {
                params[0] = t.identifier('item');
              }
              if (!params[1]) {
                params[1] = t.identifier('index');
              }
              const forItem = params[0];
              const forIndex = params[1];
              const properties = [];
              let returnElPath;
              if (t.isBlockStatement(body)) {
                returnElPath = getReturnElementPath(body).get('argument');
              } else {
                returnElPath = path.get('arguments')[0].get('body');
              }
              returnElPath.traverse({
                Identifier(innerPath) {
                  if (innerPath.findParent(p => p.node.__bindEvent)) return;
                  if (
                    innerPath.scope.hasBinding(innerPath.node.name)
                    || innerPath.node.name === forItem.name
                    || innerPath.node.name === forIndex.name
                    && !(t.isMemberExpression(innerPath.parent) && innerPath.parent.property !== innerPath.node)
                  ) {
                    innerPath.node.__listItem = {
                      jsxplus: false,
                      item: forItem.name
                    };

                    // Skip duplicate keys.
                    if (!properties.some(
                      pty => pty.key.name === innerPath.node.name)) {
                      let value = innerPath.node;
                      if (innerPath.findParent(p => p.isJSXAttribute() && p.node.name.name === 'style')) {
                        value = t.callExpression(t.identifier('__create_style__'), [value]);
                        useCreateStyle = true;
                      }
                      properties.push(t.objectProperty(innerPath.node, value));
                    }
                  }
                },
                JSXAttribute(innerPath) {
                  // Handle renderItem
                  const { node } = innerPath;
                  if (node.name.name === 'data'
                    && t.isStringLiteral(node.value)
                  ) {
                    const fnIdx = findIndex(renderItemFunctions, (fn) => node.value.value === `{{...${fn.name}}}`);
                    if (fnIdx > -1) {
                      const renderItem = renderItemFunctions[fnIdx];
                      node.value = t.stringLiteral(`${node.value.value.replace('...', `...${forItem.name}.`)}`);
                      properties.push(t.objectProperty(t.identifier(renderItem.name), renderItem.node));
                      renderItemFunctions.splice(fnIdx, 1);
                    }
                  }
                }
              });

              const listBlock = createJSX('block', {
                [adapter.for]: t.jsxExpressionContainer(node),
                [adapter.forItem]: t.stringLiteral(forItem.name),
                [adapter.forIndex]: t.stringLiteral(forIndex.name),
              }, [returnElPath.node]);

              // Mark jsx list meta for generate by code.
              listBlock.__jsxlist = {
                args: [t.identifier(forItem.name), t.identifier(forIndex.name)],
                iterValue: callee.object,
                generated: true,
                jsxplus: false,
                loopFnBody: body
              };

              parentPath.replaceWith(listBlock);
              returnElPath.replaceWith(t.objectExpression(properties));
            } else if (t.isIdentifier(args[0]) || t.isMemberExpression(args[0])) {
              // { foo.map(this.xxx) }
              throw new Error(`The syntax conversion for ${genExpression(node)} is currently not supported. Please use inline functions.`);
            }
          }
        }
      }
    }
  });
  return useCreateStyle;
}

module.exports = {
  parse(parsed, code, options) {
    const useCreateStyle = transformList(parsed.templateAST, parsed.renderItemFunctions, options.adapter);
    // In list item maybe use __create_style__
    if (!parsed.useCreateStyle) {
      parsed.useCreateStyle = useCreateStyle;
    }
  },

  // For test cases.
  _transformList: transformList,
};
