const t = require('@babel/types');
const traverse = require('../utils/traverseNodePath');
const getReturnElementPath = require('../utils/getReturnElementPath');
const createJSX = require('../utils/createJSX');
const createBinding = require('../utils/createBinding');
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

        let replacedIter;
        const parentJSXElement = path.findParent(p => p.isJSXElement());

        if (parentJSXElement) {
          if (t.isMemberExpression(callee)) {
            if (t.isIdentifier(callee.property, { name: 'map' })) {
              const parentListJSXElementPath = path.findParent(p => p.isJSXElement() && p.node.__isList);
              const parentListMeta = parentListJSXElementPath
                ? parentListJSXElementPath.node.__listMeta
                : null;
              const iterId = iters++;
              if (parentListMeta) {
                replacedIter = parentListMeta.itemName + '.' + '_l' + iterId;
                const key = t.identifier('_l' + iterId);
                parentListMeta.properties.push(t.objectProperty(key, node));
                // Reset name to original for callee.object.
                if (t.isIdentifier(node.callee.object) && node.callee.object.__originalName) {
                  node.callee.object.name = node.callee.object.__originalName;
                }
              } else {
                replacedIter = '_l' + iterId;
                dynamicValue[replacedIter] = node;
              }

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
                  const replacement = `${itemName}.${id.name}`;
                  path.traverse({
                    Identifier(idPath) {
                      if (idPath.node === id) return;
                      if (idPath.node.__skipReplace) return;
                      if (idPath.node.name === originalName) {
                        idPath.node.__originalName = idPath.node.name;
                        idPath.node.name = replacement;
                        // Mark for element to not add to dynamic value.
                        idPath.node.__skipDynamicValue = true;
                      }
                    }
                  });

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

                const listBlock = createJSX('block', {
                  [adapter.for]: t.stringLiteral(createBinding(replacedIter)),
                  [adapter.forItem]: t.stringLiteral(itemName),
                  [adapter.forIndex]: t.stringLiteral(indexName),
                }, [childNode]);
                listBlock.__isList = true;
                listBlock.__listMeta = {
                  itemName, indexName, properties
                };
                parentPath.replaceWith(listBlock);
              } else if (t.isIdentifier(args[0]) || t.isMemberExpression(args[0])) {
                // { foo.map(this.xxx) }
                throw new Error(`The syntax conversion for ${genExpression(node)} is currently not supported. Please use inline functions.`);
              }
            }
          }
        }
      },
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
