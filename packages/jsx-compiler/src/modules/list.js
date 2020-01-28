const t = require('@babel/types');
const traverse = require('../utils/traverseNodePath');
const getReturnElementPath = require('../utils/getReturnElementPath');
const createJSX = require('../utils/createJSX');
const genExpression = require('../codegen/genExpression');
const findIndex = require('../utils/findIndex');
const getListIndex = require('../utils/getListIndex');
const handleParentListReturn = require('../utils/handleParentListReturn');

/**
 * Transfrom map method
 * @param {NodePath} path function or CallExpression path
 * @param {Array} renderItemFunctions render function items
 * @param {Scope} fnScope original function scope
 * @param {Object} adapter
 */
function transformMapMethod(path, renderItemFunctions, fnScope, code, adapter) {
  let useCreateStyle = false;
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
        const { params, body } = mapCallbackFn;
        // original index identifier
        let originalIndex;
        // If item or index doesn't exist， set default value to params
        if (!params[0]) {
          params[0] = t.identifier('item');
        }
        // record original index identifier
        if (params[1]) {
          originalIndex = params[1].name;
        }
        // Use increasing new index identifier instead of original index
        params[1] = getListIndex();

        const forItem = params[0];
        const forIndex = params[1];
        const properties = [
          t.objectProperty(params[0], params[0]),
          t.objectProperty(params[1], params[1])
        ];

        const iterValue = callee.object;
        // handle parentList
        const [forNode, parentList] = handleParentListReturn(node, iterValue, code);

        // __jsxlist
        const jsxList = {
          args: [t.identifier(forItem.name), t.identifier(forIndex.name)],
          iterValue,
          jsxplus: false,
          parentList,
          loopFnBody: body
        };

        // map callback function return path;
        let returnElPath;
        if (t.isBlockStatement(body)) {
          returnElPath = getReturnElementPath(body).get('argument');
        } else {
          returnElPath = path.get('arguments')[0].get('body');
        }
        returnElPath.traverse({
          Identifier(innerPath) {
            const innerNode = innerPath.node;
            // console.log('innerPath.node.__listItem', innerPath.node.name, innerPath.node.__listItem);
            if (innerPath.findParent(p => p.node.__bindEvent)) return;

            if (!innerPath.parentPath.isMemberExpression() && originalIndex === innerNode.name) {
              innerNode.name = forIndex.name;
            }
            if (
              argumentsPath[0].scope.hasBinding(innerNode.name)
              || innerNode.name === forItem.name
              || innerNode.name === forIndex.name
              && !(t.isMemberExpression(innerPath.parent) && innerPath.parent.property !== innerNode)
            ) {
              innerNode.__listItem = {
                jsxplus: false,
                item: forItem.name,
                parentList: jsxList
              };

              // Skip duplicate keys.
              if (!properties.some(
                pty => pty.key.name === innerNode.name)) {
                let value = innerNode;
                if (innerPath.findParent(p => p.isJSXAttribute() && p.node.name.name === 'style')) {
                  value = t.callExpression(t.identifier('__create_style__'), [value]);
                  useCreateStyle = true;
                }
                properties.push(t.objectProperty(innerNode, value));
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
          [adapter.for]: t.jsxExpressionContainer(forNode),
          [adapter.forItem]: t.stringLiteral(forItem.name),
          [adapter.forIndex]: t.stringLiteral(forIndex.name),
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
