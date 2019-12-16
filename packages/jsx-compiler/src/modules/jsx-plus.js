const t = require('@babel/types');
const DynamicBinding = require('../utils/DynamicBinding');
const traverse = require('../utils/traverseNodePath');
const getListItem = require('../utils/getListItem');
const CodeError = require('../utils/CodeError');
const createJSX = require('../utils/createJSX');
const findIndex = require('../utils/findIndex');

const directiveIf = 'x-if';
const directiveElseif = 'x-elseif';
const directiveElse = 'x-else';
const conditionTypes = {
  [directiveIf]: 'if',
  [directiveElseif]: 'elseif',
  [directiveElse]: 'else',
};

let listIndexCount = 0;

/**
 * Get condition type, enum of {if|elseif|else|null}
 */
function getCondition(jsxElement) {
  if (t.isJSXOpeningElement(jsxElement.openingElement)) {
    const { attributes } = jsxElement.openingElement;
    for (let i = 0, l = attributes.length; i < l; i++) {
      if (t.isJSXAttribute(attributes[i])) {
        switch (attributes[i].name.name) {
          case directiveIf:
          case directiveElseif:
          case directiveElse:
            return {
              type: conditionTypes[attributes[i].name.name],
              value: t.isJSXExpressionContainer(attributes[i].value)
                ? attributes[i].value.expression
                : attributes[i].value,
              index: i,
            };
        }
      }
    }
  }
  return null;
}


function transformDirectiveCondition(ast, adapter) {
  traverse(ast, {
    JSXElement(path) {
      const { node } = path;
      const condition = getCondition(node);
      if (condition !== null && condition.value !== null && condition.type === conditionTypes[directiveIf]) {
        const { type, value, index } = condition;
        const conditions = [];
        node.openingElement.attributes.splice(index, 1);
        conditions.push({
          type,
          value,
          jsxElement: node,
        });

        let continueSearch = false;
        let nextJSXElPath = path;
        let nextJSXElCondition;
        do {
          nextJSXElPath = nextJSXElPath.getSibling(nextJSXElPath.key + 1);
          if (nextJSXElPath.isJSXText() && nextJSXElPath.node.value.trim() === '') {
            continueSearch = true;
          } else if (nextJSXElPath.isJSXElement()
            && (nextJSXElCondition = getCondition(nextJSXElPath.node))) {
            conditions.push({
              type: nextJSXElCondition.type,
              value: nextJSXElCondition.value,
              jsxElement: nextJSXElPath.node,
            });
            nextJSXElPath.node.openingElement.attributes.splice(nextJSXElCondition.index, 1);
            continueSearch = true;
          } else {
            continueSearch = false;
          }
        } while (continueSearch);

        conditions.forEach(({ type, value, jsxElement }) => {
          const { attributes } = jsxElement.openingElement;
          const attr = type === conditionTypes[directiveElse]
            ? t.jsxAttribute(t.jsxIdentifier(adapter[type]))
            : t.jsxAttribute(
              t.jsxIdentifier(adapter[type]),
              t.jsxExpressionContainer(value)
            );
          attributes.push(attr);
        });
      }
    }
  });
}

// babel-plugin-transform-jsx-class
function transformDirectiveClass(ast, parsed) {
  let useClassnames = false;

  traverse(ast, {
    Program(path) {
      path.__classHelperImported = false;
    },
    JSXOpeningElement(parentPath) {
      const attributePaths = parentPath.get('attributes') || [];
      const attributes = parentPath.node.attributes || [];

      attributePaths.some(function(path) {
        const { node } = path;
        if (t.isJSXIdentifier(node.name, { name: 'x-class' })) {
          const params = [];
          if (t.isJSXExpressionContainer(node.value)) params.push(node.value.expression);
          else if (t.isStringLiteral(node.value)) params.push(node.value);

          const callExp = t.callExpression(t.identifier('__classnames__'), params);

          let classNameAttribute;
          for (let i = 0, l = attributes.length; i < l; i++ ) {
            if (t.isJSXIdentifier(attributes[i].name, { name: 'className'})) classNameAttribute = attributes[i];
          }

          if (classNameAttribute) {
            let prevVal;
            if (t.isJSXExpressionContainer(classNameAttribute.value)) prevVal = classNameAttribute.value.expression;
            else if (t.isStringLiteral(classNameAttribute.value)) prevVal = classNameAttribute.value;
            else prevVal = t.stringLiteral('');

            classNameAttribute.value = t.jsxExpressionContainer(
              t.binaryExpression('+', t.binaryExpression('+', prevVal, t.stringLiteral(' ')), callExp)
            );
          } else {
            attributes.push(t.jsxAttribute(
              t.jsxIdentifier('className'),
              t.jsxExpressionContainer(callExp)
            ));
          }

          path.remove();
          useClassnames = true;

          return true;
        }
      });
    },
  });

  if (parsed) {
    parsed.useClassnames = useClassnames;
  }
}

function transformDirectiveList(ast, code, adapter) {
  traverse(ast, {
    JSXAttribute(path) {
      const { node } = path;
      if (t.isJSXIdentifier(node.name, { name: 'x-for' })) {
        // Check stynax.
        if (!t.isJSXExpressionContainer(node.value)) {
          throw new CodeError(code, node, node.loc, 'Invalid x-for usage');
        }
        const { expression } = node.value;
        // params[2] is original index identifier
        let params = [];
        let iterValue;
        if (t.isBinaryExpression(expression, { operator: 'in' })) {
          // x-for={(item, index) in value}
          const { left, right } = expression;
          iterValue = right;
          if (t.isSequenceExpression(left)) {
            // x-for={(item, key) in value}
            params = left.expressions.concat(createIndexNode());
          } else if (t.isIdentifier(left)) {
            // x-for={item in value}
            params = [left, createIndexNode(), createIndexNode()];
          } else {
            // x-for={??? in value}
            throw new Error('Stynax error of x-for.');
          }
        } else {
          // x-for={value}, x-for={callExp()}, ...
          iterValue = expression;
          params = [t.identifier('item'), createIndexNode(), createIndexNode()];
        }
        const parentJSXEl = path.findParent(p => p.isJSXElement());
        // Transform x-for iterValue to map function
        const properties = [
          t.objectProperty(params[0], params[0]),
          t.objectProperty(params[1], params[1])
        ];
        const loopFnBody = t.blockStatement([
          t.returnStatement(
            t.objectExpression(properties)
          )
        ]);
        const mapCallExpression = t.callExpression(
          t.memberExpression(iterValue, t.identifier('map')),
          [
            t.arrowFunctionExpression(params, loopFnBody)
          ]);
        const listItem = getListItem(iterValue);
        let parentList;
        if (listItem) {
          parentList = listItem.__listItem.parentList;
          if (parentList) {
            // Rename index name
            if (listItem.__listItem.index === params[1].name) {
              params[1].name += listIndexCount++;
            } else {
              params.splice(2);
            }
            /**
             * Assign an new object to item
             * item: { ...item, info: item.info.map(i => {})
             * */
            const loopFnBodyLength = parentList.loopFnBody.body.length;
            const properties = parentList.loopFnBody.body[loopFnBodyLength - 1].argument.properties;
            const forItem = properties.find(({key}) => key.name === listItem.name);
            if (t.isIdentifier(iterValue)) {
              forItem.value = mapCallExpression;
            }
            if (t.isMemberExpression(iterValue)) {
              switch (forItem.value.type) {
                case 'Identifier':
                  if (t.isIdentifier(iterValue.object)) {
                    forItem.value = t.objectExpression([
                      t.spreadElement(forItem.value),
                      t.objectProperty(iterValue.property, mapCallExpression)
                    ]);
                  } else {
                    throw new CodeError(code, iterValue, iterValue.loc, "Currently doesn't support x-for={it in item.info.list} in nested list");
                  }
                  break;
                case 'ObjectExpression':
                  forItem.value.properties.push(
                    t.objectProperty(iterValue.property, mapCallExpression)
                  );
                  break;
              }
            }
          } else {
            throw new CodeError(code, iterValue, iterValue.loc, 'Nested x-for list only supports MemberExpression and Identifier，like x-for={item.list} or x-for={item}.');
          }
        } else {
          iterValue = mapCallExpression;
        }
        const parentAttributes = path.parentPath.node.attributes;
        const keyAttrIndex = findIndex(parentAttributes, attr => t.isJSXIdentifier(attr.name, {
          name: 'key'
        }));
        const listAttr = {};
        if (keyAttrIndex > -1) {
          listAttr.key = parentAttributes[keyAttrIndex].value;
          path.parentPath.node.attributes = [
            ...parentAttributes.slice(0, keyAttrIndex),
            ...parentAttributes.slice(keyAttrIndex + 1)
          ];
        }
        const listEl = createJSX('block', listAttr, [
          parentJSXEl.node
        ]);
        listEl.__jsxlist = {
          args: params,
          iterValue,
          loopFnBody,
          parentList,
          jsxplus: true
        };
        parentJSXEl.replaceWith(listEl);
        transformListJSXElement(parentJSXEl, adapter);
        path.remove();
      }
    }
  });
}

function transformComponentFragment(ast) {
  function transformFragment(path) {
    if (t.isJSXIdentifier(path.node.name, { name: 'Fragment' })) {
      path.get('name').replaceWith(t.jsxIdentifier('block'));
    }
  }

  traverse(ast, {
    JSXOpeningElement: transformFragment,
    JSXClosingElement: transformFragment,
  });
  return null;
}

function transformSlotDirective(ast, adapter) {
  traverse(ast, {
    JSXAttribute(path) {
      const { node } = path;
      if (t.isJSXNamespacedName(node.name) && t.isJSXIdentifier(node.name.namespace, { name: 'x-slot'})) {
        const slotName = node.name.name;
        const slotScopeName = node.value;
        if (slotScopeName) {
          const parentJSXOpeningEl = path.parentPath.node;
          if (adapter.slotScope) {
            parentJSXOpeningEl.attributes.push(t.jsxAttribute(t.jsxIdentifier('slot-scope'), slotScopeName));
          }
          const parentJSXElPath = path.parentPath.parentPath;
          parentJSXElPath.traverse({
            Identifier(innerPath) {
              if (innerPath.node.name === slotScopeName.value) {
                innerPath.node.__slotScope = true;
              }
            }
          });
        }
        path.replaceWith(t.jsxAttribute(t.jsxIdentifier('slot'), t.stringLiteral(slotName.name)));
      }
    }
  });
}

function transformListJSXElement(path, adapter) {
  const { node } = path;
  const { attributes } = node.openingElement;
  const dynamicFilter = new DynamicBinding('_f');
  const filters = [];
  if (node.__jsxlist && !node.__jsxlist.generated) {
    const { args, iterValue } = node.__jsxlist;
    path.traverse({
      Identifier(innerPath) {
        const {node: innerNode} = innerPath;
        if (args.find(arg => arg.name === innerNode.name)) {
          // Rename index node
          innerNode.__listItem = {
            jsxplus: true,
            item: args[0].name,
            index: args[1].name,
            originalIndex: args[2] ? args[2].name : args[1].name,
            parentList: node.__jsxlist
          };
          // <View x-for={items} data-item={setDataset(item)}>
          //   <Text class={classnames({ selected: index > 0 })}>{parse(item, index)}</Text>
          // </View>
          const containerPath = innerPath.findParent(p => p.isJSXExpressionContainer());
          if (containerPath && t.isCallExpression(containerPath.node.expression)) {
            const filterName = dynamicFilter.add({ expression: containerPath.node.expression });
            containerPath.node.expression.__listItemFilter = {
              item: args[0].name, // item
              filter: filterName // _f0
            };
            filters.push(containerPath.node.expression);
          }
        }
      }
    });
    if (args.length === 3) {
      args.splice(2);
    }
    attributes.push(
      t.jsxAttribute(
        t.jsxIdentifier(adapter.for),
        t.jsxExpressionContainer(iterValue)
      )
    );
    args.forEach((arg, index) => {
      attributes.push(
        t.jsxAttribute(
          t.jsxIdentifier([adapter.forItem, adapter.forIndex][index]),
          t.stringLiteral(arg.name)
        )
      );
      // Mark skip ids.
      const skipIds = node.skipIds = node.skipIds || new Map();
      skipIds.set(arg.name, true);
    });
    if (filters.length) {
      // return {
      //   item: item,
      //   index: index,
      //   "_f0": setDataset(item),
      //   "_f1": classnames({ selected: index > 0 })
      //   "_f2": parse(item, index)
      // }
      const loopBody = node.__jsxlist.loopFnBody.body;
      const properties = loopBody[loopBody.length - 1].argument.properties;
      filters.forEach(function(f) {
        properties.push(t.objectProperty(t.identifier(f.__listItemFilter.filter), f));
      });
    }

    node.__jsxlist.generated = true;
  }
}

function createIndexNode() {
  return t.identifier('index');
}

module.exports = {
  parse(parsed, code, options) {
    if (parsed.renderFunctionPath) {
      transformDirectiveClass(parsed.templateAST, parsed);
      transformDirectiveCondition(parsed.templateAST, options.adapter);
      transformDirectiveList(parsed.templateAST, code, options.adapter);
      transformComponentFragment(parsed.templateAST);
      transformSlotDirective(parsed.templateAST, options.adapter);
    }
  },
  _transformList: transformDirectiveList,
  _transformClass: transformDirectiveClass,
  _transformCondition: transformDirectiveCondition,
  _transformFragment: transformComponentFragment,
  _transformSlotDirective: transformSlotDirective
};
