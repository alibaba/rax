const t = require('@babel/types');
const traverse = require('../utils/traverseNodePath');
const getReturnElementPath = require('../utils/getReturnElementPath');
const createJSX = require('../utils/createJSX');
const createBinding = require('../utils/createBinding');
const createJSXBinding = require('../utils/createJSXBinding');
const genExpression = require('../codegen/genExpression');

function transformList(ast, adapter) {
  let iters = 0;
  const dynamicValue = {};
  let fnScope;

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
            // <tag onClick={props.onClick.bind(this, item)} />
            // => <tag onClick={props.onClick.bind(this, item)} />
            // parentPath => JSXContainerExpression
            // parentPath.parentPath => JSXAttribute
            // parentPath.parentPath.parentPath => JSXOpeningElement
            const { attributes } = parentPath.parentPath.parentPath.node;
            if (Array.isArray(args)) {
              args.forEach((arg, index) => {
                if (index === 0) {
                  // first arg is `this` context.
                  const strValue = t.isThisExpression(arg) ? 'this' : createBinding(genExpression(arg, {
                    concise: true,
                    comments: false,
                  }));
                  attributes.push(
                    t.jsxAttribute(
                      t.jsxIdentifier('data-arg-context'),
                      t.stringLiteral(strValue)
                    )
                  );
                } else {
                  attributes.push(
                    t.jsxAttribute(
                      t.jsxIdentifier('data-arg-' + (index - 1)),
                      t.jsxExpressionContainer(arg)
                    )
                  );
                }
              });
            }
            path.replaceWith(callee.object);
          }
        }
      },
      exit(path) {
        const { node, parentPath } = path;
        const { callee, arguments: args } = node;
        let replacedIter;
        const parentJSXElement = path.findParent(p => p.isJSXElement());

        if (parentJSXElement) {
          if (t.isMemberExpression(callee)) {
            if (t.isIdentifier(callee.property, { name: 'map' })) {
              const iterId = iters++;
              replacedIter = '_l' + iterId;
              dynamicValue[replacedIter] = node;

              // { foo.map(fn) }
              let childNode = null;
              const itemName = '_item' + iterId;
              const indexName = '_index' + iterId;
              const scope = `${replacedIter}[${indexName}]`;

              if (t.isFunction(args[0])) {
                const properties = [];
                args[0].params.forEach((id, index) => {
                  if (!t.isIdentifier(id)) return;
                  const originalName = id.name;
                  const replacement = `${scope}.${id.name}`;
                  fnScope.rename(id.name, replacement);

                  // Reset params to original.
                  const key = args[0].params[index] = t.identifier(originalName);
                  properties.push(t.objectProperty(key, key));
                });

                // { foo.map(() => {}) }
                let returnEl;
                if (t.isBlockStatement(args[0].body)) {
                  // () => { return xxx }
                  const returnElPath = getReturnElementPath(args[0].body).get('argument');
                  returnEl = returnElPath.node;
                  returnElPath.replaceWith(t.objectExpression(properties));
                } else {
                  // () => (<jsx></jsx)
                  const returnElPath = path.get('arguments')[0].get('body');
                  returnEl = returnElPath.node;
                  returnElPath.replaceWith(t.objectExpression(properties));
                }

                childNode = returnEl;

                parentPath.replaceWith(
                  createJSX('block', {
                    [adapter.for]: t.jsxExpressionContainer(t.identifier(replacedIter)),
                    [adapter.forItem]: t.stringLiteral(itemName),
                    [adapter.forIndex]: t.stringLiteral(indexName),
                  }, [childNode])
                );
              } else if (t.isIdentifier(args[0]) || t.isMemberExpression(args[0])) {
                // { foo.map(this.xxx) }
                throw new Error(`The syntax conversion for ${genExpression(node)} is currently not supported. Please use inline functions.`);
              }
            } else {
              throw new Error(`Syntax conversion using ${genExpression(node)} in JSX templates is currently not supported, and can be replaced with static templates or state calculations in advance.`);
            }
          } else if (t.isIdentifier(callee)) {
            // { foo(args) }
            throw new Error(`Syntax conversion using ${genExpression(node)} in JSX templates is currently not supported, and can be replaced with static templates or state calculations in advance.`);
          } else if (t.isFunction(callee)) {
            throw new Error(`Currently using IIFE in JSX templates is not supported: ${genExpression(node)} 。`);
          }
        }
      },
    },
  });

  return { dynamicValue };
}

module.exports = {
  parse(parsed, code, options) {
    console.log(genExpression(parsed.templateAST))
    const { dynamicValue } = transformList(parsed.templateAST, options.adapter);
    Object.assign(parsed.dynamicValue = parsed.dynamicValue || {}, dynamicValue);
  },

  // For test cases.
  _transformList: transformList,
};
