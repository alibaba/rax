const t = require('@babel/types');
const traverse = require('../utils/traverseNodePath');
const getReturnElementPath = require('../utils/getReturnElementPath');
const createJSX = require('../utils/createJSX');
const genExpression = require('../codegen/genExpression');
const findIndex = require('../utils/findIndex');
const getListIndex = require('../utils/getListIndex');
const handleParentListReturn = require('../utils/handleParentListReturn');
const DynamicBinding = require('../utils/DynamicBinding');
const handleValidIdentifier = require('../utils/handleValidIdentifier');
const handleListStyle = require('../utils/handleListStyle');
const handleListProps = require('../utils/handleListProps');

/**
 * Transfrom map method
 * @param {NodePath} path function or CallExpression path
 * @param {object} parsed render function items
 * @param {string} code - original code
 * @param {object} adapter
 */
function transformMapMethod(path, parsed, code, adapter) {
  const dynamicStyle = new DynamicBinding('_s');
  const dynamicValue = new DynamicBinding('_d');
  const renderItemFunctions = parsed.renderItemFunctions;

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

        if (!t.isBlockStatement(body)) {
          // create a block return for inline return
          body = t.blockStatement([t.returnStatement(body)]);
          argumentsPath[0].get('body').replaceWith(body);
        }

        // __jsxlist
        const jsxList = {
          args: [t.identifier(forItem.name), t.identifier(renamedIndex.name)],
          iterValue,
          jsxplus: false,
          parentList,
          loopFnBody: body
        };

        // map callback function return path;
        const returnElPath = getReturnElementPath(body).get('argument');

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
            // Handle renderItem
            if (node.name.name === 'data'
                && t.isStringLiteral(node.value)
            ) {
              const fnIdx = findIndex(renderItemFunctions || [], (fn) => node.value.value === `{{...${fn.name}}}`);
              if (fnIdx > -1) {
                const renderItem = renderItemFunctions[fnIdx];
                node.value = t.stringLiteral(`${node.value.value.replace('...', `...${forItem.name}.`)}`);
                properties.push(t.objectProperty(t.identifier(renderItem.name), renderItem.node));
                renderItemFunctions.splice(fnIdx, 1);
              }
            }
            // Handle style
            const useCreateStyle = handleListStyle(argumentsPath[0].get('body'), innerPath, forItem, originalIndex, renamedIndex.name, properties, dynamicStyle, code);
            if (!parsed.useCreateStyle) {
              parsed.useCreateStyle = useCreateStyle;
            }
            // Handle props
            handleListProps(innerPath, forItem, originalIndex, renamedIndex.name, properties, dynamicValue);
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
}

function transformList(parsed, code, adapter) {
  const ast = parsed.templateAST;
  traverse(ast, {
    ArrowFunctionExpression(path) {
      transformMapMethod(path, parsed, code, adapter);
    },
    FunctionExpression(path) {
      transformMapMethod(path, parsed, code, adapter);
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
        transformMapMethod(path, parsed, code, adapter);
      }
    }
  });
}

module.exports = {
  parse(parsed, code, options) {
    transformList(parsed, code, options.adapter);
  },

  // For test cases.
  _transformList: transformList,
};
