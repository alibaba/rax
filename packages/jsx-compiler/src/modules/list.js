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

  traverse(ast, {
    CallExpression(path) {
      const { node, parentPath } = path;
      const { callee, arguments: args } = node;

      if (parentPath.parentPath.isJSXElement()) {
        if (t.isMemberExpression(callee)) {
          if (t.isIdentifier(callee.property, { name: 'map' })) {
            const iterId = iters++;
            const replacedIter = '_l' + iterId;
            dynamicValue[replacedIter] = node;

            // { foo.map(fn) }
            let childNode = null;
            const itemName = '_item' + iterId;
            const indexName = '_index' + iterId;
            const scope = `${replacedIter}[${indexName}]`;

            if (t.isFunction(args[0])) {
              const properties = [];
              traverse(path, {
                Identifier(path) {
                  const { node, parentPath } = path;
                  if (parentPath.isJSXExpressionContainer()) {
                    // <view foo={bar} />
                    properties.push(t.objectProperty(node, node));
                    parentPath.replaceWith(t.stringLiteral(createBinding(`${scope}.${node.name}`)));
                  } else if (false) {
                    // <view foo={{ bar }} />
                  } else if (parentPath.isMemberExpression() && parentPath.node.object === node && parentPath.node !== callee) {
                    // <view foo={{ bar: item.bar }} />
                    properties.push(t.objectProperty(node, node));
                    parentPath.replaceWith((t.identifier(scope)));
                  }
                },
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
                  [adapter.for]: t.stringLiteral(createBinding(replacedIter)),
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
      } else if (parentPath.parentPath.isJSXAttribute()) {
        if (t.isMemberExpression(callee) && t.isIdentifier(callee.property, { name: 'bind' })) {
          // <tag onClick={props.onClick.bind(this, item)} />
          // => <tag onClick={props.onClick.bind(this, item)} />
          // parentPath => JSXContainerExpression
          // parentPath.parentPath => JSXAttribute
          // parentPath.parentPath.parentPath => JSXOpeningElement
          const attributes = parentPath.parentPath.parentPath.node.attributes;
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
                    t.stringLiteral(createBinding(genExpression(arg, {
                      concise: true,
                      comments: false,
                    })))
                  )
                );
              }
            });
          }
          path.replaceWith(callee.object);
        }
      }
    },
  });

  return { dynamicValue };
}

module.exports = {
  parse(parsed, code, options) {
    const { dynamicValue } = transformList(parsed.templateAST, options.adapter);
    Object.assign(parsed.dynamicValue = parsed.dynamicValue || {}, dynamicValue);
  },

  // For test cases.
  _transformList: transformList,
};
