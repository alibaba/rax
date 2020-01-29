const t = require('@babel/types');
const traverse = require('../utils/traverseNodePath');
const getReturnElementPath = require('../utils/getReturnElementPath');
const createJSX = require('../utils/createJSX');
const createBinding = require('../utils/createBinding');
const genExpression = require('../codegen/genExpression');
const findIndex = require('../utils/findIndex');
const getListIndex = require('../utils/getListIndex');
const handleParentListReturn = require('../utils/handleParentListReturn');
const DynamicBinding = require('../utils/DynamicBinding');
const CodeError = require('../utils/CodeError');
const handleScopeIdentifier = require('../utils/handleScopeIdentifier');
const handleValidIdentifier = require('../utils/handleValidIdentifier');

/**
 * Transfrom map method
 * @param {NodePath} path function or CallExpression path
 * @param {Array} renderItemFunctions render function items
 * @param {Scope} fnScope original function scope
 * @param {Object} adapter
 */
function transformMapMethod(path, renderItemFunctions, fnScope, code, adapter) {
  let useCreateStyle = false;
  const dynamicStyle = new DynamicBinding('_s');

  const { node, parentPath } = path;
  if (node.__transformedList) return;
  node.__transformedList = true;
  const { callee } = node;
  if (t.isMemberExpression(callee)) {
    if (t.isIdentifier(callee.property, { name: 'map' })) {
      const argumentsPath = path.get('arguments');
      const mapCallbackFn = argumentsPath[0].node;
      /*
      * params is item & index
      * <block a:for-item="params[0]" a:for-index="params[1]" ></block>
      */
      if (t.isFunction(mapCallbackFn)) {
        let { params, body } = mapCallbackFn;
        // original index identifier
        let originalIndex;
        // If item or index doesn't exist， set default value to params
        if (!params[0]) {
          params[0] = t.identifier('item');
        }
        // Create increasing new index identifier
        const renamedIndex = getListIndex();

        // record original index identifier
        if (params[1]) {
          originalIndex = params[1].name;
        } else {
          params[1] = renamedIndex;
        }


        const forItem = params[0];
        const forIndex = params[1];
        const properties = [
          t.objectProperty(params[0], params[0]),
          t.objectProperty(renamedIndex, renamedIndex)
        ];

        const iterValue = callee.object;
        // handle parentList
        const [forNode, parentList] = handleParentListReturn(node, iterValue, code);

        // __jsxlist
        const jsxList = {
          args: [t.identifier(forItem.name), t.identifier(renamedIndex.name)],
          iterValue,
          jsxplus: false,
          parentList,
          loopFnBody: body
        };

        // map callback function return path;
        let returnElPath;
        if (!t.isBlockStatement(body)) {
          // create a block return for inline return
          body = t.blockStatement([t.returnStatement(body)]);
          argumentsPath[0].get('body').replaceWith(body);
        }
        returnElPath = getReturnElementPath(body).get('argument');

        returnElPath.traverse({
          Identifier(innerPath) {
            const innerNode = innerPath.node;
            if (innerPath.findParent(p => p.node.__bindEvent)) return;
            handleValidIdentifier(innerPath, () => {
              const isScope = returnElPath.scope.hasBinding(innerNode.name);
              const isItem = innerNode.name === forItem.name;
              const isIndex = innerNode.name === forIndex.name;
              if (isScope || isItem || isIndex) {
                innerNode.__listItem = {
                  jsxplus: false,
                  item: forItem.name,
                  parentList: jsxList
                };

                if (isIndex) {
                  // Use renamed index instead of original value
                  if (originalIndex === innerNode.name) {
                    innerNode.name = renamedIndex.name;
                  }
                }

                if (isScope) {
                  // Skip duplicate keys.
                  if (!properties.some(
                    pty => pty.key.name === innerNode.name)) {
                    properties.push(t.objectProperty(innerNode, innerNode));
                  }
                }
              }
            });
          },
          JSXAttribute(innerPath) {
            const { node } = innerPath;
            if (node.__transformed) return;
            // Handle renderItem
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
            // Handle style
            if (t.isJSXIdentifier(node.name, {
              name: 'style'
            })) {
              if (!t.isJSXExpressionContainer(node.value)) {
                throw new CodeError(code, node.value, node.loc,
                  "Style property's value should be JSXExpressionContainer, like <View style={styles.container}></View>.");
              }
              handleScopeIdentifier(argumentsPath[0].get('body'), (innerPath) => {
                if (innerPath.node.name === originalIndex) {
                  innerPath.node.name = renamedIndex.name;
                }
              }, () => {
                useCreateStyle = true;
                const name = dynamicStyle.add(node.value.expression);
                properties.push(t.objectProperty(t.identifier(name), t.callExpression(t.identifier('__create_style__'), [node.value.expression])));
                const replaceNode = t.stringLiteral(
                  createBinding(genExpression(t.memberExpression(forItem, t.identifier(name))))
                );
                // Record original expression
                replaceNode.__originalExpression = node.value.expression;
                node.value = replaceNode;
                node.__transformed = true;
              });
            }
          }
        });

        // Use renamed index instead of original params[1]
        params[1] = renamedIndex;

        const listBlock = createJSX('block', {
          [adapter.for]: t.jsxExpressionContainer(forNode),
          [adapter.forItem]: t.stringLiteral(forItem.name),
          [adapter.forIndex]: t.stringLiteral(renamedIndex.name),
        }, [returnElPath.node]);

        // Mark forItem __listItem
        forItem.__listItem = {
          jsxplus: false,
          item: forItem.name,
          parentList: jsxList
        };

        // Mark jsx list meta for generate by code.
        jsxList.generated = true;
        listBlock.__jsxlist = jsxList;

        parentPath.replaceWith(listBlock);
        returnElPath.replaceWith(t.objectExpression(properties));
      } else if (t.isIdentifier(mapCallbackFn) || t.isMemberExpression(mapCallbackFn)) {
        // { foo.map(this.xxx) }
        throw new Error(`The syntax conversion for ${genExpression(node)} is currently not supported. Please use inline functions.`);
      }
    }
  }
  return useCreateStyle;
}

function transformList(ast, renderItemFunctions, code, adapter) {
  let useCreateStyle = false;

  traverse(ast, {
    ArrowFunctionExpression(path) {
      useCreateStyle = transformMapMethod(path, renderItemFunctions, path.scope, code, adapter);
    },
    FunctionExpression(path) {
      useCreateStyle = transformMapMethod(path, renderItemFunctions, path.scope, code, adapter);
    },
    CallExpression: {
      enter(path) {
        const { node, parentPath } = path;
        const { callee } = node;
        if (parentPath.parentPath.isJSXAttribute()) {
          if (t.isMemberExpression(callee) && t.isIdentifier(callee.property, { name: 'bind' })) {
            path.node.__bindEvent = true;
          }
        }
        useCreateStyle = transformMapMethod(path, renderItemFunctions, path.scope, code, adapter);
      }
    }
  });
  return useCreateStyle;
}

module.exports = {
  parse(parsed, code, options) {
    const useCreateStyle = transformList(parsed.templateAST, parsed.renderItemFunctions, code, options.adapter);
    // In list item maybe use __create_style__
    if (!parsed.useCreateStyle) {
      parsed.useCreateStyle = useCreateStyle;
    }
  },

  // For test cases.
  _transformList: transformList,
};
