const t = require('@babel/types');
const traverse = require('../utils/traverseNodePath');
const genExpression = require('../codegen/genExpression');
const createBinding = require('../utils/createBinding');
const createJSXBinding = require('../utils/createJSXBinding');
const CodeError = require('../utils/CodeError');
const DynamicBinding = require('../utils/DynamicBinding');
const compiledComponents = require('../compiledComponents');
const baseComponents = require('../baseComponents');
const replaceComponentTagName = require('../utils/replaceComponentTagName');
const { parseExpression } = require('../parser/index');

const ATTR = Symbol('attribute');
const ELE = Symbol('element');
const isDirectiveAttr = attr => /^(a:|wx:|x-)/.test(attr);
const isEventHandlerAttr = propKey => /^on[A-Z]/.test(propKey);
const BINDING_REG = /{{|}}/g;

/**
 * 1. Normalize jsxExpressionContainer to binding var.
 * 2. Collect dynamicValue (dependent identifiers)
 * 3. Normalize function bounds.
 * @param parsed
 * @param scope
 * @param adapter
 * @param sourceCode
 */
function transformTemplate(
  {
    templateAST: ast,
    componentDependentProps = {},
    dynamicValue
  },
  scope = null,
  adapter,
  sourceCode,
) {
  const dynamicValues = new DynamicBinding('_d');
  const dynamicEvents = new DynamicBinding('_e');
  function handleJSXExpressionContainer(path) {
    const { parentPath, node } = path;
    if (node.__transformed) return;
    const type = parentPath.isJSXAttribute()
      ? ATTR // <View foo={bar} />
      : ELE; // <View>{xxx}</View>
    let { expression } = node;
    let attributeName = null;
    let isDirective;
    if (type === ATTR) {
      attributeName = parentPath.node.name.name;
      isDirective = isDirectiveAttr(attributeName);
      collectComponentDependentProps(parentPath, expression, path.get('expression'), componentDependentProps);
    } else {
      isDirective = isDirectiveAttr(attributeName);
    }

    const isEventHandler = isEventHandlerAttr(attributeName);

    switch (expression.type) {
      // <div foo={'string'} /> -> <div foo="string" />
      // <div>{'hello world'}</div> -> <div>hello world</div>
      case 'StringLiteral':
        if (type === ATTR) path.replaceWith(expression);
        else if (type === ELE) path.replaceWith(t.jsxText(expression.value));
        break;

      // <div foo={100} /> -> <div foo="{{100}}" />
      // <div>{100}</div>  -> <div>100</div>
      case 'NumericLiteral':
        if (type === ATTR) path.replaceWith(t.stringLiteral(createBinding(expression.value)));
        else if (type === ELE) path.replaceWith(t.jsxText(String(expression.value)));
        break;

      // <div foo={true} /> -> <div foo="{{true}}" />
      // <div>{true}</div>  -> <div></div>
      case 'BooleanLiteral':
        if (type === ATTR)
          path.replaceWith(t.stringLiteral(createBinding(expression.value)));
        else if (type === ELE) path.remove();
        break;

      // <div foo={null} /> -> <div foo="{{null}}" />
      // <div>{null}</div>  -> <div></div>
      case 'NullLiteral':
        if (type === ATTR)
          path.replaceWith(t.stringLiteral(createBinding('null')));
        else if (type === ELE) path.remove();
        break;

      // <div foo={/foo/} /> -> <div foo="{{_dx}}" />
      // <div>/regexp/</div>  -> <div>{{ _dx }}</div>
      case 'RegExpLiteral':
        const dynamicName = dynamicValues.add({
          expression,
          isDirective,
        });
        if (type === ATTR) {
          path.replaceWith(t.stringLiteral(createBinding(dynamicName)));
        } else if (type === ELE) {
          path.replaceWith(createJSXBinding(dynamicName));
        }
        break;

      // <div foo={`hello ${exp}`} /> -> <div foo="hello {{exp}}" />
      // <div>/regexp/</div>  -> <div>{{ _dx }}</div>
      case 'TemplateLiteral':
        if (type === ELE)
          throw new CodeError(
            sourceCode,
            node,
            node.loc,
            'Unsupported TemplateLiteral in JSXElement Children:',
          );

        if (path.isTaggedTemplateExpression()) break;

        const { quasis, expressions } = node.expression;
        const nodes = [];
        let index = 0;

        for (const elem of quasis) {
          if (elem.value.cooked) {
            nodes.push(t.stringLiteral(elem.value.cooked));
          }

          if (index < expressions.length) {
            const expr = expressions[index++];
            if (!t.isStringLiteral(expr, { value: '' })) {
              nodes.push(expr);
            }
          }
        }

        if (!t.isStringLiteral(nodes[0]) && !t.isStringLiteral(nodes[1])) {
          nodes.unshift(t.stringLiteral(''));
        }

        let retString = '';
        for (let i = 0; i < nodes.length; i++) {
          if (t.isStringLiteral(nodes[i])) {
            retString += nodes[i].value;
          } else {
            const name = dynamicValues.add({
              expression: nodes[i],
              isDirective,
            });
            retString += createBinding(name);
          }
        }

        path.replaceWith(t.stringLiteral(retString));
        break;

      // <div foo={bar} /> -> <div foo="{{bar}}" />
      // <div>{bar}</div>  -> <div>{{ bar }}</div>
      case 'Identifier':
        if (type === ATTR) {
          if (expression.name === 'undefined') {
            parentPath.remove(); // Remove jsxAttribute
            break;
          } else if (isEventHandler) {
            const name = dynamicEvents.add({
              expression,
              isDirective,
            });
            path.replaceWith(t.stringLiteral(name));
          } else {
            const replaceNode = transformIdentifier(
              expression,
              dynamicValues,
              isDirective,
            );
            path.replaceWith(
              t.stringLiteral(createBinding(genExpression(replaceNode))),
            );
          }
        } else if (type === ELE) {
          if (expression.name === 'undefined') {
            path.remove(); // Remove expression
            break;
          } else {
            const replaceNode = transformIdentifier(
              expression,
              dynamicValues,
              isDirective,
            );
            path.replaceWith(createJSXBinding(genExpression(replaceNode)));
          }
        }
        break;

      // Remove no usage.
      case 'JSXEmptyExpression':
        path.remove();
        break;

      // <tag onClick={() => {}} /> => <tag onClick="_e0" />
      // <tag>{() => {}}</tag> => throw Error
      case 'ArrowFunctionExpression':
      case 'FunctionExpression':
        if (type === ELE)
          throw new CodeError(
            sourceCode,
            node,
            node.loc,
            'Unsupported Function in JSXElement:',
          );

        if (!isEventHandler)
          throw new CodeError(
            sourceCode,
            node,
            node.loc,
            `Only EventHandlers are supported in Mini Program, eg: onClick/onChange, instead of "${attributeName}".`,
          );
        const callExp = expression.body;
        const args = callExp.arguments;
        const { attributes } = parentPath.parentPath.node;
        const fnExpression = t.isCallExpression(callExp) ? callExp.callee : expression;
        const name = dynamicEvents.add({
          expression: fnExpression,
          isDirective,
        });
        const formatName = formatEventName(name);
        if (Array.isArray(args)) {
          const fnFirstParam = expression.params[0];
          if (!(args.length === 1 && t.isIdentifier(args[0], {
            name: fnFirstParam && fnFirstParam.name
          }))) {
            args.forEach((arg, index) => {
              const transformedArg = transformCallExpressionArg(arg, dynamicValues, isDirective);
              attributes.push(
                t.jsxAttribute(
                  t.jsxIdentifier(`data-${formatName}-arg-` + index),
                  t.stringLiteral(
                    createBinding(
                      genExpression(transformedArg, {
                        concise: true,
                        comments: false,
                      }),
                    ),
                  ),
                ),
              );
            });
          }
        }
        path.replaceWith(t.stringLiteral(name));
        break;

      // <tag key={this.props.name} key2={a.b} /> => <tag key="{{_d0.name}}" key2="{{_d1.b}}" />
      // <tag>{ foo.bar }</tag> => <tag>{{ _d0.bar }}</tag>
      case 'MemberExpression':
        if (type === ATTR) {
          if (isEventHandler) {
            const name = dynamicEvents.add({
              expression,
              isDirective,
            });
            const replaceNode = t.stringLiteral(name);
            replaceNode.__transformed = true;
            path.replaceWith(replaceNode);
          } else {
            const replaceNode = transformMemberExpression(
              expression,
              dynamicValues,
              isDirective,
            );
            replaceNode.__transformed = true;
            path.replaceWith(
              t.stringLiteral(createBinding(genExpression(replaceNode))),
            );
          }
        } else if (type === ELE) {
          const replaceNode = transformMemberExpression(
            expression,
            dynamicValues,
            isDirective,
          );
          path.replaceWith(createJSXBinding(genExpression(replaceNode)));
        }
        break;

      // <tag foo={fn()} /> => <tag foo="{{_d0}} /> _d0 = fn();
      // <tag>{fn()}</tag> => <tag>{{ _d0 }}</tag> _d0 = fn();
      // <tag x-for={item in items}>{fn(item)}</tag> => <tag a:for={item in items}>{{ item._f0 }}</tag> item._f0 = fn();
      case 'CallExpression':
        if (expression.__listItemFilter) {
          const { item, filter } = expression.__listItemFilter;
          path.replaceWith(t.stringLiteral(createBinding(`${item}.${filter}`)));
        } else if (type === ATTR) {
          if (
            isEventHandler &&
            t.isMemberExpression(expression.callee) &&
            t.isIdentifier(expression.callee.property, { name: 'bind' })
          ) {
            // function bounds
            const callExp = node.expression;
            const args = callExp.arguments;
            const { attributes } = parentPath.parentPath.node;
            const name = dynamicEvents.add({
              expression: callExp.callee.object,
              isDirective,
            });
            const formatName = formatEventName(name);
            if (Array.isArray(args)) {
              args.forEach((arg, index) => {
                if (index === 0) {
                  // first arg is `this` context.
                  const strValue = t.isThisExpression(arg)
                    ? 'this'
                    : createBinding(
                      genExpression(arg, {
                        concise: true,
                        comments: false,
                      }),
                    );
                  attributes.push(
                    t.jsxAttribute(
                      t.jsxIdentifier(`data-${formatName}-arg-context`),
                      t.stringLiteral(strValue),
                    ),
                  );
                } else {
                  const transformedArg = transformCallExpressionArg(arg);
                  attributes.push(
                    t.jsxAttribute(
                      t.jsxIdentifier(`data-${formatName}-arg-` + (index - 1)),
                      t.stringLiteral(
                        createBinding(
                          genExpression(transformedArg, {
                            concise: true,
                            comments: false,
                          }),
                        ),
                      ),
                    ),
                  );
                }
              });
            }

            path.replaceWith(t.stringLiteral(name));
          } else {
            const name = dynamicValues.add({
              expression,
              isDirective,
            });
            path.replaceWith(t.stringLiteral(createBinding(name)));
          }
        } else if (type === ELE) {
          // Skip `array.map(iterableFunction)`.
          const name = dynamicValues.add({
            expression,
            isDirective,
          });
          path.replaceWith(createJSXBinding(name));
        }
        break;

      case 'ConditionalExpression':
      case 'BinaryExpression':
      case 'UnaryExpression':
      case 'LogicalExpression':
      case 'SequenceExpression':
      case 'NewExpression':
      case 'ObjectExpression':
      case 'ArrayExpression':
        if (hasComplexExpression(path)) {
          const expressionName = dynamicValues.add({
            expression,
            isDirective,
          });
          if (type === ATTR)
            path.replaceWith(t.stringLiteral(createBinding(expressionName)));
          else if (type === ELE)
            path.replaceWith(createJSXBinding(expressionName));
        } else {
          path.traverse({
            Identifier(innerPath) {
              if (
                innerPath.node.__transformed ||
                innerPath.parentPath.isMemberExpression() ||
                innerPath.parentPath.isObjectProperty() ||
                innerPath.node.__listItem && !innerPath.node.__listItem.item
              )
                return;
              const replaceNode = transformIdentifier(
                innerPath.node,
                dynamicValues,
                isDirective,
              );
              replaceNode.__transformed = true;
              innerPath.replaceWith(replaceNode);
            },
            // <tag>{a ? a.b[c.d] : 1}</tag> => <tag>{{_d0 ? _d0.b[_d1.d] : 1}}</tag>
            MemberExpression(innerPath) {
              if (innerPath.node.__transformed) return;
              const replaceNode = transformMemberExpression(
                innerPath.node,
                dynamicValues,
                isDirective,
              );
              replaceNode.__transformed = true;
              innerPath.replaceWith(replaceNode);
            },
            ObjectExpression(innerPath) {
              if (innerPath.node.__transformed) return;
              const replaceProperties = transformObjectExpression(
                innerPath.node,
                dynamicValues,
                isDirective,
              );
              const replaceNode = t.objectExpression(replaceProperties);
              replaceNode.__transformed = true;
              innerPath.replaceWith(replaceNode);
              expression = innerPath.node;
            },
          });

          if (type === ATTR)
            path.replaceWith(
              t.stringLiteral(
                createBinding(
                  genExpression(expression, {
                    concise: true,
                    comments: false,
                  }),
                ),
              ),
            );
          else if (type === ELE)
            path.replaceWith(createJSXBinding(genExpression(expression)));
        }
        break;
      default: {
        throw new CodeError(
          sourceCode,
          node,
          node.loc,
          `Unsupported Stynax in JSX Elements, ${expression.type}:`,
        );
      }
    }

    node.__transformed = true;
  }

  traverse(ast, {
    JSXAttribute(path) {
      const attrName = path.node.name.name;
      if (['__parentId', '__tagId'].indexOf(attrName) > -1) {
        return;
      }
      const originalAttrValue = path.node.value;
      if (t.isStringLiteral(originalAttrValue)) {
        let clearBindAttrValue;
        if (dynamicValue) {
          clearBindAttrValue = dynamicValue[originalAttrValue.value.replace(BINDING_REG, '')];
        }
        const attrValue = clearBindAttrValue || originalAttrValue;
        collectComponentDependentProps(path, attrValue, null, componentDependentProps);
      }
    },
    JSXExpressionContainer: handleJSXExpressionContainer,
    JSXOpeningElement: {
      exit(path) {
        const { node } = path;
        const componentTagNode = node.name;
        if (t.isJSXIdentifier(componentTagNode)) {
          const name = componentTagNode.name;
          // Handle rax-view
          const replaceName = compiledComponents[name];
          if (replaceName) {
            replaceComponentTagName(path, t.jsxIdentifier(replaceName));
            const propsMap = adapter[replaceName];
            let hasClassName = false;
            node.attributes.forEach(attr => {
              if (t.isJSXIdentifier(attr.name)) {
                const attrName = attr.name.name;
                if (attrName === 'class') {
                  attr.value.value = propsMap.className + ' ' + attr.value.value;
                  hasClassName = true;
                }
                if (propsMap[attrName] && attrName !== 'className') {
                  attr.name.name = propsMap[attrName];
                }
              }
            });
            if (!hasClassName) {
              node.attributes.push(
                t.jsxAttribute(
                  t.jsxIdentifier('class'),
                  t.stringLiteral(propsMap.className),
                ),
              );
            }
          }
          // Handle native components, like rax-text
          if (baseComponents.indexOf(name) > -1 && adapter.needTransformEvent) {
            node.attributes.forEach(attr => {
              if (attr.value && attr.value.value && attr.value.value.indexOf('_e') > -1) {
                attr.name.name = `bind${attr.name.name}`;
              }
            });
          }
        }
      },
    },
  });

  return {
    dynamicValues: dynamicValues.getStore(),
    dynamicEvents: dynamicEvents.getStore(),
  };
}

function hasComplexExpression(path) {
  let complex = false;
  if (path.isCallExpression()) return true;
  if (path.isTemplateLiteral()) return true;
  if (path.isUnaryExpression() && path.node.operator !== '!') return true;

  function isComplex(p) {
    complex = true;
    p.stop();
  }
  traverse(path, {
    NewExpression: isComplex,
    CallExpression: isComplex,
    TemplateLiteral: isComplex,
    // It's hard to process objectExpression nested, same as arrayExp.
    UnaryExpression(innerPath) {
      if (innerPath.node.operator !== '!') {
        isComplex(innerPath);
      }
    },
    ObjectExpression(innerPath) {
      const { properties } = innerPath.node;
      const checkNested = properties.some(property => {
        const { value } = property;
        return (
          !t.isIdentifier(value) &&
          !t.isMemberExpression(value) &&
          !t.isBinaryExpression(value)
        );
      });
      if (checkNested) {
        isComplex(innerPath);
      }
    },
    ArrayExpression: isComplex,
    TaggedTemplateExpression: isComplex,
  });

  return complex;
}

/**
 * Transform MemberExpression
 * */
function transformMemberExpression(expression, dynamicBinding, isDirective) {
  if (checkMemberHasThis(expression)) {
    const name = dynamicBinding.add({
      expression,
      isDirective,
    });
    return t.identifier(name);
  }
  const { object, property } = expression;
  let { computed } = expression;
  let objectReplaceNode = object;
  let propertyReplaceNode = property;
  if (!object.__transformed) {
    // if object is ThisExpression, replace thw whole expression with _d0
    if (t.isThisExpression(object)) {
      const name = dynamicBinding.add({
        expression,
        isDirective,
      });
      const replaceNode = t.identifier(name);
      replaceNode.__transformed = true;
      return replaceNode;
    }
    if (t.isIdentifier(object)) {
      objectReplaceNode = transformIdentifier(
        object,
        dynamicBinding,
        isDirective,
      );
      objectReplaceNode.__transformed = true;
    }
    if (t.isMemberExpression(object)) {
      objectReplaceNode = transformMemberExpression(
        object,
        dynamicBinding,
        isDirective,
      );
    }
  }

  if (!property.__transformed) {
    if (t.isMemberExpression(property)) {
      propertyReplaceNode = transformMemberExpression(
        property,
        dynamicBinding,
        isDirective,
      );
    }
    if (computed && t.isIdentifier(property) && property.__listItem) { // others[index] => others[item.index]
      propertyReplaceNode = transformIdentifier(
        property,
        dynamicBinding,
        isDirective,
      );
      propertyReplaceNode.__transformed = true;
    }
  }

  return t.memberExpression(objectReplaceNode, propertyReplaceNode, computed);
}

/**
 * Transform Identifier
 * */
function transformIdentifier(expression, dynamicBinding, isDirective) {
  let replaceNode;
  if (
    expression.__listItem && !expression.__listItem.item
    || expression.__templateVar
    || expression.__slotScope
  ) {
    // The identifier is x-for args or template variable or map's index
    replaceNode = expression;
  } else if (expression.__listItem && expression.__listItem.item) {
    const itemNode = t.identifier(expression.__listItem.item);
    itemNode.__listItem = {
      jsxplus: expression.__listItem.jsxplus,
    };
    if (expression.name === expression.__listItem.originalIndex) {
      expression.name = expression.__listItem.index;
    }
    replaceNode = t.memberExpression(itemNode, expression);
  } else {
    const name = dynamicBinding.add({
      expression,
      isDirective,
    });
    replaceNode = t.identifier(name);
  }
  return replaceNode;
}

/**
 * Transform ObjectExpression
 * */
function transformObjectExpression(expression, dynamicBinding, isDirective) {
  const { properties } = expression;
  return properties.map(property => {
    const { key, value } = property;
    let replaceNode = value;
    if (t.isIdentifier(value)) {
      replaceNode = transformIdentifier(value, dynamicBinding, isDirective);
    }
    if (t.isMemberExpression(value)) {
      replaceNode = transformMemberExpression(
        value,
        dynamicBinding,
        isDirective,
      );
    }
    if (t.isObjectExpression(value)) {
      replaceNode = transformObjectExpression(
        value,
        dynamicBinding,
        isDirective,
      );
    }
    return t.objectProperty(key, replaceNode);
  });
}

/**
 * Transform CallExpression arg
 * @param {Object} ast
 */
function transformCallExpressionArg(ast, dynamicValues, isDirective) {
  let arg;
  switch (ast.type) {
    case 'Identifier':
      ast = transformIdentifier(ast, dynamicValues, isDirective);
      break;
    case 'MemberExpression':
      ast = transformMemberExpression(ast, dynamicValues, isDirective);
    default:
      traverse(ast, {
        Identifier(innerPath) {
          const { node: innerNode } = innerPath;
          if (innerNode.__listItem) {
            const item = innerNode.__listItem.item;
            innerPath.replaceWith(
              t.memberExpression(
                t.identifier(item),
                t.identifier(innerNode.name),
              ),
            );
          }
        },
      });
      break;
  }
  if (!arg) {
    arg = ast;
  }
  return arg;
}

function checkMemberHasThis(expression) {
  const { object, property } = expression;
  let hasThisExpression = false;
  if (t.isThisExpression(object)) {
    hasThisExpression = true;
  }
  if (t.isIdentifier(object)) {
    hasThisExpression = false;
  }
  if (t.isMemberExpression(object)) {
    hasThisExpression = checkMemberHasThis(object);
  }
  return hasThisExpression;
}

/**
 * JSXAttribute path
 * */
function collectComponentDependentProps(path, attrValue, attrPath, componentDependentProps) {
  const { node } = path;
  const attrName = node.name.name;
  const jsxEl = path.findParent(p => p.isJSXElement()).node;
  const isDirective = isDirectiveAttr(attrName);
  if (
    !isDirective
    && attrValue.type
    && jsxEl.__tagId
  ) {
    if (attrPath) {
      attrValue = parseExpression('(' + attrPath.toString() + ')'); // deep clone
    }
    componentDependentProps[jsxEl.__tagId].props =
      componentDependentProps[jsxEl.__tagId].props || {};
    componentDependentProps[jsxEl.__tagId].props[
      attrName
    ] = attrValue;
  }
}

// _e0 -> e0
function formatEventName(name) {
  return name.replace('_', '');
}

module.exports = {
  parse(parsed, code, options) {
    if (parsed.renderFunctionPath) {
      const { dynamicValues, dynamicEvents } = transformTemplate(
        parsed,
        null,
        options.adapter,
        code
      );

      const dynamicValue = dynamicValues.reduce((prev, curr, vals) => {
        const name = curr.name;
        prev[name] = curr.value;
        return prev;
      }, {});
      Object.assign(parsed.dynamicValue, dynamicValue);
      parsed.dynamicEvents = dynamicEvents;
      parsed.eventHandlers = dynamicEvents.map(e => e.name);
    }
  },
  // For test export.
  _transform: transformTemplate,
};
