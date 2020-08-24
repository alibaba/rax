const t = require('@babel/types');
const traverse = require('../utils/traverseNodePath');
const genExpression = require('../codegen/genExpression');
const createBinding = require('../utils/createBinding');
const createJSXBinding = require('../utils/createJSXBinding');
const CodeError = require('../utils/CodeError');
const DynamicBinding = require('../utils/DynamicBinding');
const getCompiledComponents = require('../getCompiledComponents');
const baseComponents = require('../baseComponents');
const replaceComponentTagName = require('../utils/replaceComponentTagName');
const { parseExpression } = require('../parser/index');
const isSlotScopeNode = require('../utils/isSlotScopeNode');
const { isDirectiveAttr, isEventHandlerAttr, isRenderPropsAttr, BINDING_REG } = require('../utils/checkAttr');
const handleValidIdentifier = require('../utils/handleValidIdentifier');
const isNativeComponent = require('../utils/isNativeComponent');
const { componentCommonProps } = require('../adapter');

const ATTR = Symbol('attribute');
const ELE = Symbol('element');

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
  adapter,
  sourceCode
) {
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
    const isRenderProps = isRenderPropsAttr(attributeName);

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
        const dynamicName = dynamicValue.add({
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
            const name = dynamicValue.add({
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
              dynamicValue,
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
              dynamicValue,
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

        if (!isEventHandler && !isRenderProps) {
          throw new CodeError(
            sourceCode,
            node,
            node.loc,
            `Only EventHandlers (like onClick/onChange) and render props (which starts with 'render') are supported in Mini Program, instead of "${attributeName}".`,
          );
        }
        if (isEventHandler) {
          const params = (expression.params || []).map(param => {
            // Compatibility (event = {}) => handleClick(event)
            if (t.isAssignmentPattern(param)) {
              return param.left;
            }
            return param;
          });
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
                const transformedArg = transformCallExpressionArg(arg, params, dynamicValue, isDirective);
                if (transformedArg.__dataset) {
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
                }
              });
            }
          }
          path.replaceWith(t.stringLiteral(name));
        }
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
              dynamicValue,
              {
                isDirective,
                needRegisterProps: adapter.needRegisterProps
              },
            );
            replaceNode.__transformed = true;
            path.replaceWith(
              t.stringLiteral(createBinding(genExpression(replaceNode))),
            );
          }
        } else if (type === ELE) {
          const replaceNode = transformMemberExpression(
            expression,
            dynamicValue,
            {
              isDirective,
              needRegisterProps: adapter.needRegisterProps
            },
          );
          path.replaceWith(createJSXBinding(genExpression(replaceNode)));
        }
        break;

      // <tag foo={fn()} /> => <tag foo="{{_d0}} /> _d0 = fn();
      // <tag>{fn()}</tag> => <tag>{{ _d0 }}</tag> _d0 = fn();
      case 'CallExpression':
        if (type === ATTR) {
          if (isEventHandler) {
            const isBindCallExpression = t.isMemberExpression(expression.callee) &&
            t.isIdentifier(expression.callee.property, { name: 'bind' });
            // function bounds
            const callExp = node.expression;
            const args = callExp.arguments;
            const { attributes } = parentPath.parentPath.node;
            const name = dynamicEvents.add({
              expression: isBindCallExpression ? callExp.callee.object : callExp.callee,
              isDirective,
            });
            const formatName = formatEventName(name);
            if (Array.isArray(args)) {
              args.forEach((arg, index) => {
                // If is handleClick.bind(this, 1), valid args index should subtract 1
                const argsIndex = isBindCallExpression ? index - 1 : index;
                if (isBindCallExpression && index === 0) {
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
                  const transformedArg = transformCallExpressionArg(arg, [], dynamicValue, isDirective);
                  attributes.push(
                    t.jsxAttribute(
                      t.jsxIdentifier(`data-${formatName}-arg-${argsIndex}`),
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
            const name = dynamicValue.add({
              expression,
              isDirective,
            });
            path.replaceWith(t.stringLiteral(createBinding(name)));
          }
        } else if (type === ELE) {
          // Skip `array.map(iterableFunction)`.
          const name = dynamicValue.add({
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
          const expressionName = dynamicValue.add({
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
                dynamicValue,
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
                dynamicValue,
                {
                  isDirective,
                  needRegisterProps: adapter.needRegisterProps
                },
              );
              replaceNode.__transformed = true;
              innerPath.replaceWith(replaceNode);
            },
            ObjectExpression(innerPath) {
              if (innerPath.node.__transformed) return;
              const replaceProperties = transformObjectExpression(
                innerPath.node,
                dynamicValue,
                {
                  isDirective,
                  needRegisterProps: adapter.needRegisterProps
                },
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
      if (['__tagId'].indexOf(attrName) > -1) {
        return;
      }
      const originalAttrValue = path.node.value;
      if (t.isStringLiteral(originalAttrValue)) {
        let clearBindAttrValue;
        clearBindAttrValue = dynamicValue.getExpression(originalAttrValue.value.replace(BINDING_REG, ''))
        || originalAttrValue.__originalExpression;
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
          const replaceName = getCompiledComponents(adapter.platform)[name];
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
            if (!hasClassName && propsMap.className) {
              node.attributes.push(
                t.jsxAttribute(
                  t.jsxIdentifier('class'),
                  t.stringLiteral(propsMap.className),
                ),
              );
            }
          }

          // Handle native components
          // In native components, events in componentCommonProps should be transformed
          // Other Events should be changed if needTransformEvent
          if (isNativeComponent(componentTagNode, adapter.platform)) {
            node.attributes.forEach(attr => {
              const attrName = attr.name.name;
              if (componentCommonProps[adapter.platform][attrName]) {
                attr.name.name = componentCommonProps[adapter.platform][attrName];
              } else if (attr.value && attr.value.value && attr.value.value.indexOf('_e') > -1 && adapter.needTransformEvent) {
                attr.name.name = attr.name.name.replace('on', 'bind').toLowerCase();
              }
            });
          } else if (adapter.needTransformEvent && baseComponents.indexOf(name) > -1) {
            // Rax base component should add bind before onXXX
            // While events in custom component should not be changed
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
function transformMemberExpression(expression, dynamicBinding, options, isRecursion) {
  /**
   * Example: a.b
   * a is object, b is property
   * when the expression is a['b']
   */
  const { object, property, computed } = expression;
  const { isDirective, needRegisterProps } = options;

  if (!isRecursion) {
    if (!computed && !needRegisterProps) {
      expression = filterPropsAsObject(expression);
      if (t.isIdentifier(expression)) {
        return expression;
      }
    }

    if (checkMemberHasThis(expression)) {
      const name = dynamicBinding.add({
        expression,
        isDirective,
      });
      return t.identifier(name);
    }
  }


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
        options,
      );
      objectReplaceNode.__transformed = true;
    }
    if (t.isMemberExpression(object)) {
      objectReplaceNode = transformMemberExpression(
        object,
        dynamicBinding,
        options,
        true,
      );
    }
  }

  if (!property.__transformed) {
    if (t.isMemberExpression(property)) {
      propertyReplaceNode = transformMemberExpression(
        property,
        dynamicBinding,
        options,
        true,
      );
    }
    if (computed) { // others[index] => others[item.index]
      switch (property.type) {
        case 'Identifier':
          propertyReplaceNode = transformIdentifier(
            property,
            dynamicBinding,
            isDirective,
          );
          break;
        case 'MemberExpression':
          propertyReplaceNode = transformMemberExpression(
            property,
            dynamicBinding,
            options,
            true,
          );
          break;
        default:
          const name = dynamicBinding.add({
            expression: property,
            isDirective,
          });
          propertyReplaceNode = t.identifier(name);
          break;
      }
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
function transformObjectExpression(expression, dynamicBinding, options) {
  const { properties } = expression;
  return properties.map(property => {
    const { key, value } = property;
    let replaceNode = value;
    if (t.isIdentifier(value)) {
      replaceNode = transformIdentifier(value, dynamicBinding, options.isDirective);
    }
    if (t.isMemberExpression(value)) {
      replaceNode = transformMemberExpression(
        value,
        dynamicBinding,
        options,
      );
    }
    if (t.isObjectExpression(value)) {
      replaceNode = transformObjectExpression(
        value,
        dynamicBinding,
        options,
      );
    }
    return t.objectProperty(key, replaceNode);
  });
}

/**
 * Transform CallExpression arg
 * @param {object} ast - arguments node
 * @param {Array} params - ArrowFunctionExpression's params, like event in event => handleClick()
 * @param {object} dynamicValue
 * @param {boolean} isDirective
 */
function transformCallExpressionArg(ast, params, dynamicValue, isDirective) {
  switch (ast.type) {
    case 'Identifier':
      // Exclude the event object
      if (!params.some(param => param.name === ast.name)) {
        ast = transformIdentifier(ast, dynamicValue, isDirective);
        ast.__dataset = true;
      }
      break;
    default:
      traverse(ast, {
        Identifier(innerPath) {
          handleValidIdentifier(innerPath, () => {
            const { node: innerNode } = innerPath;
            if (!innerNode.__transformed) {
              // Exclude the event object
              if (!params.some(param => param.name === ast.name)) {
                const replaceNode = transformIdentifier(innerNode, dynamicValue, isDirective);
                innerPath.replaceWith(replaceNode);
              }
              innerPath.node.__transformed = true;
            }
          });
        },
      });
      ast.__dataset = true;
      break;
  }

  return ast;
}

function filterPropsAsObject(expression) {
  const code = genExpression(expression);
  const result = code.replace(/^props\.|this\.props\./, '');
  return parseExpression(result);
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
    && !isSlotScopeNode(attrValue)
    && attrValue.type
    && jsxEl.__tagId
  ) {
    // renderClosureFunction should replace the node itself
    if (attrValue.__renderClosureFunction) {
      attrValue = attrValue.__renderClosureFunction;
    } else {
      // Replace list render replaced node
      traverse(attrPath, {
        StringLiteral(innerPath) {
          if (BINDING_REG.test(innerPath.node.value)) {
            attrValue = innerPath.node.__originalExpression;
          }
        }
      });
      if (attrPath) {
        attrValue = parseExpression('(' + attrPath.toString() + ')'); // deep clone
      }
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
      // Set global dynamic value
      parsed.dynamicValue = new DynamicBinding('_d');
      const { dynamicEvents } = transformTemplate(
        parsed,
        options.adapter,
        code
      );

      parsed.dynamicEvents = dynamicEvents;
      parsed.eventHandlers = dynamicEvents.map(e => e.name);
    }
  },
  // For test export.
  _transform: transformTemplate,
};
