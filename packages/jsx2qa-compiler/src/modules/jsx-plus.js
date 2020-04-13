const t = require('@babel/types');
const DynamicBinding = require('../utils/DynamicBinding');
const traverse = require('../utils/traverseNodePath');
const CodeError = require('../utils/CodeError');
const createListIndex = require('../utils/createListIndex');
const handleParentListReturn = require('../utils/handleParentListReturn');
const handleValidIdentifier = require('../utils/handleValidIdentifier');
const handleListStyle = require('../utils/handleListStyle');
const handleListProps = require('../utils/handleListProps');
const handleListJSXExpressionContainer = require('../utils/handleListJSXExpressionContainer');
const getParentListPath = require('../utils/getParentListPath');

const directiveIf = 'x-if';
const directiveElseif = 'x-elseif';
const directiveElse = 'x-else';
const conditionTypes = {
  [directiveIf]: 'if',
  [directiveElseif]: 'elseif',
  [directiveElse]: 'else',
};

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
          for (let i = 0, l = attributes.length; i < l; i++) {
            if (t.isJSXIdentifier(attributes[i].name, { name: 'className' })) classNameAttribute = attributes[i];
          }

          const spaceNode = t.stringLiteral(' ');
          if (classNameAttribute) {
            if (t.isJSXExpressionContainer(classNameAttribute.value)) {
              // ClassName is {'container-el'} => className={`${'container-el'}${' '}${x-class-value}`}
              classNameAttribute.value =
                t.jsxExpressionContainer(t.templateLiteral(
                  [createHolderTemplateEl(), createHolderTemplateEl(),
                    createHolderTemplateEl(), createHolderTemplateEl()],
                  [classNameAttribute.value.expression, spaceNode, callExp]));
            } else {
              // ClassName is "container-el" => className={`container-el ${x-class-value}`}
              const prevVal = t.isStringLiteral(classNameAttribute.value) ? classNameAttribute.value.value : '';
              classNameAttribute.value =
                t.jsxExpressionContainer(t.templateLiteral(
                  [t.templateElement(
                    { raw: prevVal, cooked: prevVal }, true
                  ), createHolderTemplateEl(), createHolderTemplateEl()],
                  [spaceNode, callExp]));
            }
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

function transformDirectiveList(parsed, code, adapter) {
  const ast = parsed.templateAST;
  traverse(ast, {
    JSXAttribute(path) {
      const { node } = path;
      if (t.isJSXIdentifier(node.name, { name: 'x-for' })) {
        // Check stynax.
        if (!t.isJSXExpressionContainer(node.value)) {
          throw new CodeError(code, node, node.loc, 'Invalid x-for usage');
        }
        const dynamicStyle = new DynamicBinding('s');
        const dynamicValue = new DynamicBinding('d');
        const { expression } = node.value;
        let params = [];
        let forNode;
        // original index identifier
        let originalIndex;
        // create new index identifier
        const forIndex = createListIndex();
        if (t.isBinaryExpression(expression, { operator: 'in' })) {
          // x-for={(item, index) in value}
          const { left, right } = expression;
          forNode = right;
          if (t.isSequenceExpression(left)) {
            // x-for={(item, key) in value}
            params = left.expressions;
            originalIndex = params[1].name;
            // Repalce index identifier
            params[1] = forIndex;
          } else if (t.isIdentifier(left)) {
            // x-for={item in value}
            params = [left, forIndex];
          } else {
            // x-for={??? in value}
            throw new Error('Stynax error of x-for.');
          }
        } else {
          // x-for={value}, x-for={callExp()}, ...
          forNode = expression;
          params = [t.identifier('item'), forIndex];
        }
        const parentJSXEl = path.findParent(p => p.isJSXElement());
        // Transform x-for forNode to map function
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
          t.memberExpression(forNode, t.identifier('map')),
          [
            t.arrowFunctionExpression(params, loopFnBody)
          ]);

        const parentListPath = getParentListPath(path, adapter);

        const parentList = parentListPath && parentListPath.node.__jsxlist;
        forNode = handleParentListReturn(mapCallExpression, forNode, parentList, dynamicValue, code);

        // <Component x-for={(item in list)} /> => <Component a:for={list} a:for-item="item" />
        parentJSXEl.node.__jsxlist = {
          args: params,
          forNode,
          loopFnBody,
          parentList,
          originalIndex,
          jsxplus: true
        };
        transformListJSXElement(parsed, parentJSXEl, dynamicStyle, dynamicValue, code, adapter);
        parentJSXEl._forParams = {
          forItem: params[0].name,
          forIndex: params[1].name,
          forList: expression.right.name
        };
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
      if (t.isJSXNamespacedName(node.name) && t.isJSXIdentifier(node.name.namespace, { name: 'x-slot' })) {
        const slotName = node.name.name;
        const slotScopeName =
          node.value || t.stringLiteral('__defaultScopeName');
        const parentJSXOpeningEl = path.parentPath.node;

        if (adapter.slotScope && slotScopeName) {
          parentJSXOpeningEl.attributes.push(t.jsxAttribute(t.jsxIdentifier('slot-scope'), slotScopeName));
        }

        const parentJSXElPath = path.parentPath.parentPath;
        parentJSXElPath.traverse({
          Identifier(innerPath) {
            if (
              innerPath.node.name === slotScopeName.value &&
              !(
                innerPath.parentPath.isMemberExpression() &&
                innerPath.parent.property === innerPath.node
              )
            ) {
              innerPath.node.__slotScope = true;
            }
          },
          JSXOpeningElement(innerPath) {
            // mark slot element
            innerPath.node.__slotChildEl = {
              scopeName: slotScopeName
            };
          }
        });
        path.replaceWith(t.jsxAttribute(t.jsxIdentifier('slot'), t.stringLiteral(slotName.name)));
      }
    }
  });
}

function transformListJSXElement(parsed, path, dynamicStyle, dynamicValue, code, adapter) {
  const { node } = path;
  const { attributes } = node.openingElement;

  if (node.__jsxlist && !node.__jsxlist.generated) {
    const { args, forNode, originalIndex, loopFnBody } = node.__jsxlist;
    const loopBody = loopFnBody.body;
    const properties = loopBody[loopBody.length - 1].argument.properties;
    path.traverse({
      Identifier(innerPath) {
        const { node: innerNode } = innerPath;
        // Replace index identifier which is the same as original index in list
        handleValidIdentifier(innerPath, () => {
          if (originalIndex === innerNode.name) {
            innerNode.name = args[1].name;
          }
        });
        if (args.find(arg => arg.name === innerNode.name)) {
          innerNode.__listItem = {
            jsxplus: true,
            item: args[0].name,
            index: args[1].name,
            parentList: node.__jsxlist
          };
        }
      },
      JSXAttribute: {
        exit(innerPath) {
          // Handle style
          const useCreateStyle = handleListStyle(null, innerPath, args[0], originalIndex, args[1].name, properties, dynamicStyle, code);
          if (!parsed.useCreateStyle) {
            parsed.useCreateStyle = useCreateStyle;
          }
          // Handle props
          handleListProps(innerPath, args[0], originalIndex, args[1].name, properties, dynamicValue, code, adapter);
        }
      },
      JSXExpressionContainer: {
        exit(innerPath) {
          if (!innerPath.findParent(p => p.isJSXAttribute()) && !(innerPath.node.__index === args[1].name)) {
            handleListJSXExpressionContainer(innerPath, args[0], originalIndex, args[1].name, properties, dynamicValue);
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
        t.jsxExpressionContainer(forNode)
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
    node.__jsxlist.generated = true;
  }
}

module.exports = {
  parse(parsed, code, options) {
    if (parsed.renderFunctionPath) {
      // x-for must be first.
      transformDirectiveClass(parsed.templateAST, parsed);
      transformDirectiveList(parsed, code, options.adapter);
      transformDirectiveCondition(parsed.templateAST, options.adapter);
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

// Create place holder template element
function createHolderTemplateEl() {
  return t.templateElement(
    { raw: '' }, false
  );
}
