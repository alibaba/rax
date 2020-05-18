const t = require('@babel/types');
const traverse = require('../utils/traverseNodePath');
const getReturnElementPath = require('../utils/getReturnElementPath');
const createJSX = require('../utils/createJSX');
const genExpression = require('../codegen/genExpression');
const findIndex = require('../utils/findIndex');
const createListIndex = require('../utils/createListIndex');
const handleParentListReturn = require('../utils/handleParentListReturn');
const DynamicBinding = require('../utils/DynamicBinding');
const handleValidIdentifier = require('../utils/handleValidIdentifier');
const handleListStyle = require('../utils/handleListStyle');
const handleListProps = require('../utils/handleListProps');
const handleListJSXExpressionContainer = require('../utils/handleListJSXExpressionContainer');
const getParentListPath = require('../utils/getParentListPath');

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
  const renderPropsFunctions = parsed.renderPropsFunctions;

  // Avoid transfrom x-for result
  if (path.findParent(p => p.isJSXAttribute())) return;

  const { node, parentPath } = path;
  if (node.__transformedList) return;
  node.__transformedList = true;
  const { callee } = node;
  if (t.isMemberExpression(callee)) {
    if (t.isIdentifier(callee.property, { name: 'map' })) {
      const argumentsPath = path.get('arguments');
      const mapCallbackFn = argumentsPath[0].node;
      const mapCallbackFnBodyPath = argumentsPath[0].get('body');
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
        const renamedIndex = createListIndex();

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
        const parentListPath = getParentListPath(path, adapter);

        const parentList = parentListPath && parentListPath.node.__jsxlist;

        const forNode = handleParentListReturn(node, iterValue, parentList, dynamicValue, code);

        if (!t.isBlockStatement(body)) {
          // create a block return for inline return
          body = t.blockStatement([t.returnStatement(body)]);
          mapCallbackFnBodyPath.replaceWith(body);
        }

        // __jsxlist
        const jsxList = {
          args: [t.identifier(forItem.name), t.identifier(renamedIndex.name)],
          iterValue,
          jsxplus: false,
          parentList,
          loopFnBody: body
        };

        mapCallbackFnBodyPath.get('body').filter(p => !p.isReturnStatement()).map(statementPath => {
          statementPath.traverse({
            Identifier(innerPath) {
              const innerNode = innerPath.node;
              handleValidIdentifier(innerPath, () => {
                // Ensure inner node's name is original name
                if ((innerNode.loc && innerNode.loc.identifierName || innerNode.name) === forIndex.name) {
                  // Use renamed index instead of original value
                  innerNode.name = renamedIndex.name;
                }
                const declartorPath = innerPath.find(p => p.isVariableDeclarator());
                // Handle variable declaration in map function
                if (
                  declartorPath
                   && (declartorPath.node.id.start <= innerNode.start && declartorPath.node.id.end >= innerNode.end)
                   && findIndex(properties, property => property.value.name === innerNode.name) < 0) {
                  properties.push(t.objectProperty(innerNode, innerNode));
                  // Mark as from map fn body statement
                  innerNode.__isFromMapFn = true;
                }
              });
            }
          });
        });

        // map callback function return path;
        const returnElPath = getReturnElementPath(body).get('argument');
        returnElPath.traverse({
          Identifier(innerPath) {
            const innerNode = innerPath.node;
            if (innerPath.findParent(p => p.node.__bindEvent)) return;
            handleValidIdentifier(innerPath, () => {
              const isScope = returnElPath.scope.hasBinding(innerNode.name);
              const isItem = innerNode.name === forItem.name;
              // Ensure inner node's name is original name
              const isIndex = (innerNode.loc && innerNode.loc.identifierName || innerNode.name) === forIndex.name;
              if (isScope || isItem || isIndex) {
                innerNode.__listItem = {
                  jsxplus: false,
                  item: forItem.name,
                  parentList: jsxList
                };

                if (isIndex) {
                  // Use renamed index instead of original value
                  innerNode.name = renamedIndex.name;
                }
              }
            });
          },
          JSXAttribute: {
            exit(innerPath) {
              const { node } = innerPath;
              // Handle renderItem
              if (node.name.name === 'data'
                  && t.isStringLiteral(node.value)
              ) {
                const renderItemFnIdx = findIndex(renderItemFunctions || [], (fn) => node.value.value === `{{...${fn.name}}}`);
                if (renderItemFnIdx > -1) {
                  const renderItem = renderItemFunctions[renderItemFnIdx];
                  node.value = t.stringLiteral(`${node.value.value.replace('...', `...${forItem.name}.`)}`);
                  properties.push(t.objectProperty(t.identifier(renderItem.name), renderItem.node));
                  renderItemFunctions.splice(renderItemFnIdx, 1);
                }
                const renderPropsFnIdx = findIndex(renderPropsFunctions || [], (fn) => node.value.value === `{{...${fn.name}}}`);
                if (renderPropsFnIdx > -1) {
                  const renderProps = renderPropsFunctions[renderPropsFnIdx];
                  node.value = t.stringLiteral(`${node.value.value.replace('...', `...${forItem.name}.`)}`);
                  properties.push(t.objectProperty(t.identifier(renderProps.name), renderProps.node));
                  renderPropsFunctions.splice(renderPropsFnIdx, 1);
                }
              }
              // Handle style
              const useCreateStyle = handleListStyle(mapCallbackFnBodyPath, innerPath, forItem, originalIndex, renamedIndex.name, properties, dynamicStyle, code);
              if (!parsed.useCreateStyle) {
                parsed.useCreateStyle = useCreateStyle;
              }
              // Handle props
              handleListProps(innerPath, forItem, originalIndex, renamedIndex.name, properties, dynamicValue, code, adapter);
            }
          },
          JSXExpressionContainer: {
            exit(innerPath) {
              if (!innerPath.findParent(p => p.isJSXAttribute()) && !(innerPath.node.__index === renamedIndex.name)) {
                handleListJSXExpressionContainer(innerPath, forItem, originalIndex, renamedIndex.name, properties, dynamicValue);
              }
            }
          }
        });

        const listAttr = {
          [adapter.for]: t.jsxExpressionContainer(forNode),
          [adapter.forItem]: t.stringLiteral(forItem.name),
          [adapter.forIndex]: t.stringLiteral(renamedIndex.name),
        };

        if (adapter.needTransformKey && t.isJSXElement(returnElPath.node)) {
          const attributes = returnElPath.node.openingElement.attributes;
          const keyIndex = findIndex(attributes, attr => t.isJSXIdentifier(attr.name, { name: 'key' }));
          if (keyIndex > -1) {
            listAttr.key = attributes[keyIndex].value;
            attributes.splice(keyIndex, 1);
          } else {
            listAttr.key = t.stringLiteral('*this');
          }
        }

        // Use renamed index instead of original params[1]
        params[1] = renamedIndex;
        const returnEl = returnElPath.node;
        const listBlock = createJSX('block', listAttr,
          [/^JSX.*/g.test(returnEl.type) ? returnEl : t.jsxExpressionContainer(returnEl)]
        );


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
