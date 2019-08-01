const t = require('@babel/types');
const traverse = require('../utils/traverseNodePath');
const genExpression = require('../codegen/genExpression');
const createBinding = require('../utils/createBinding');
const createJSXBinding = require('../utils/createJSXBinding');
const CodeError = require('../utils/CodeError');
const DynamicBinding = require('../utils/DynamicBinding');

const ATTR = Symbol('attribute');
const ELE = Symbol('element');
const isDirectiveAttr = (attr) => /^(a:|wx:|x-)/.test(attr);

/**
 * 1. Normalize jsxExpressionContainer to binding var.
 * 2. Collect dynamicValue (dependent identifiers)
 * 3. Normalize function bounds.
 * @param ast
 * @param scope
 * @param adapter
 * @param sourceCode
 */
function transformTemplate(ast, scope = null, adapter, sourceCode, componentDependentProps = {}) {
  const dynamicValues = new DynamicBinding('_d');
  const dynamicEvents = new DynamicBinding('_e');
  function handleJSXExpressionContainer(path) {
    const { parentPath, node } = path;
    if (node.__transformed) return;
    const type = parentPath.isJSXAttribute()
      ? ATTR // <View foo={bar} />
      : ELE; // <View>{xxx}</View>
    const { expression } = node;
    const attributeName = type === ATTR
      ? parentPath.node.name.name
      : null;
    const jsxEl = type === ATTR
      ? path.findParent(p => p.isJSXElement()).node
      : null;

    const isDirective = isDirectiveAttr(attributeName);

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
        if (type === ATTR) path.replaceWith(t.stringLiteral(createBinding(expression.value)));
        else if (type === ELE) path.remove();
        break;

      // <div foo={null} /> -> <div foo="{{null}}" />
      // <div>{null}</div>  -> <div></div>
      case 'NullLiteral':
        if (type === ATTR) path.replaceWith(t.stringLiteral(createBinding('null')));
        else if (type === ELE) path.remove();
        break;

      // <div foo={/foo/} /> -> <div foo="{{_dx}}" />
      // <div>/regexp/</div>  -> <div>{{ _dx }}</div>
      case 'RegExpLiteral':
        const dynamicName = dynamicValues.add({
          expression,
          isDirective
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
        if (type === ELE) throw new CodeError(sourceCode, node, node.loc, 'Unsupported TemplateLiteral in JSXElement Children:');

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
              isDirective
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
          } else if (isEventHandler(attributeName)) {
            const name = dynamicEvents.add({
              expression,
              isDirective
            });
            path.replaceWith(t.stringLiteral(name));
          } else {
            if (!expression.__jsxlistArgs) {
              const name = dynamicValues.add({
                expression,
                isDirective
              });
              path.replaceWith(t.stringLiteral(createBinding(name)));
            } else {
              path.replaceWith(t.stringLiteral(createBinding(expression.name)));
            }
          }
          if (!isDirective && jsxEl.__pid) {
            componentDependentProps[jsxEl.__pid][attributeName] = expression;
          }
        } else if (type === ELE) {
          if (expression.name === 'undefined') {
            path.remove(); // Remove expression
            break;
          } else {
            if (!expression.__jsxlistArgs) {
              const name = dynamicValues.add({
                expression,
                isDirective
              });
              path.replaceWith(createJSXBinding(name));
            } else {
              path.replaceWith(createJSXBinding(expression.name));
            }
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
        if (type === ELE) throw new CodeError(sourceCode, node, node.loc, 'Unsupported Function in JSXElement:');

        if (!isEventHandler(attributeName)) throw new CodeError(sourceCode, node, node.loc, `Only EventHandlers are supported in Mini Program, eg: onClick/onChange, instead of "${attributeName}".`);

        const name = dynamicEvents.add({
          expression,
          isDirective
        });
        path.replaceWith(t.stringLiteral(name));
        break;

      // <tag key={this.props.name} key2={a.b} /> => <tag key="{{_d0.name}}" key2="{{_d1.b}}" />
      // <tag>{ foo.bar }</tag> => <tag>{{ _d0.bar }}</tag>
      case 'MemberExpression':
        if (type === ATTR) {
          if (isEventHandler(attributeName)) {
            const name = dynamicEvents.add({
              expression,
              isDirective
            });
            const replaceNode = t.stringLiteral(name);
            replaceNode.__transformed = true;
            path.replaceWith(replaceNode);
          } else {
            const replaceNode = transformMemberExpression(expression, dynamicValues, isDirective);
            replaceNode.__transformed = true;
            path.replaceWith(t.stringLiteral(createBinding(genExpression(replaceNode))));
            if (!isDirective && jsxEl.__pid) {
              componentDependentProps[jsxEl.__pid][name] = expression;
            }
          }
        } else if (type === ELE) {
          const replaceNode = transformMemberExpression(expression, dynamicValues, isDirective);
          path.replaceWith(createJSXBinding(genExpression(replaceNode)));
        }
        break;

      // <tag foo={fn()} /> => <tag foo="{{_d0}} /> _d0 = fn();
      // <tag>{fn()}</tag> => <tag>{{ _d0 }}</tag> _d0 = fn();
      case 'CallExpression':
        if (type === ATTR) {
          if (
            isEventHandler(attributeName)
            && t.isMemberExpression(expression.callee)
            && t.isIdentifier(expression.callee.property, { name: 'bind' })
          ) {
            // function bounds
            const callExp = node.expression;
            const args = callExp.arguments;
            const { attributes } = parentPath.parentPath.node;
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
            const name = dynamicEvents.add({
              expression: callExp.callee.object,
              isDirective
            });
            path.replaceWith(t.stringLiteral(name));
          } else {
            const name = dynamicValues.add({
              expression,
              isDirective
            });
            path.replaceWith(t.stringLiteral(createBinding(name)));
          }
        } else if (type === ELE) {
          // Skip `array.map(iterableFunction)`.
          const name = dynamicValues.add({
            expression,
            isDirective
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
            isDirective
          });
          if (type === ATTR) path.replaceWith(t.stringLiteral(createBinding(expressionName)));
          else if (type === ELE) path.replaceWith(createJSXBinding(expressionName));
        } else {
          path.traverse({
            Identifier(innerPath) {
              if (innerPath.node.__transformed
              || innerPath.parentPath.isMemberExpression()
              || innerPath.node.__jsxlistArgs) return;

              const name = dynamicValues.add({
                expression: innerPath.node,
                isDirective
              });
              const replaceNode = t.identifier(name);
              replaceNode.__transformed = true;
              innerPath.replaceWith(replaceNode);
            },
            // <tag>{a ? a.b[c.d] : 1}</tag> => <tag>{{_d0 ? _d0.b[_d1.d] : 1}}</tag>
            MemberExpression(innerPath) {
              if (innerPath.node.__transformed) return;
              const replaceNode = transformMemberExpression(innerPath.node, dynamicValues, isDirective);
              replaceNode.__transformed = true;
              innerPath.replaceWith(replaceNode);
            }
          });
          if (type === ATTR) path.replaceWith(t.stringLiteral(createBinding(genExpression(expression))));
          else if (type === ELE) path.replaceWith(createJSXBinding(genExpression(expression)));
        }
        break;
      default: {
        throw new CodeError(sourceCode, node, node.loc, `Unsupported Stynax in JSX Elements, ${expression.type}:`);
      }
    }

    node.__transformed = true;
  }

  traverse(ast, {
    JSXAttribute(path) {
      const { node } = path;
      const attrName = node.name.name;

      // Remove ref.
      if (attrName === 'ref') {
        path.remove();
      }
    },
    JSXExpressionContainer: handleJSXExpressionContainer,
  });

  return { dynamicValues: dynamicValues.getStore(), dynamicEvents: dynamicEvents.getStore() };
}

function isEventHandler(propKey) {
  return /^on[A-Z]/.test(propKey);
}

function hasComplexExpression(path) {
  let complex = false;
  if (path.isCallExpression()) return true;
  if (path.isTemplateLiteral()) return true;
  if (path.isUnaryExpression()) return true;
  function isComplex(p) {
    complex = true;
    p.stop();
  }
  traverse(path, {
    NewExpression: isComplex,
    CallExpression: isComplex,
    UnaryExpression: isComplex,
    TemplateLiteral: isComplex,
    // It's hard to process objectExpression nested, same as arrayExp.
    ObjectExpression: isComplex,
    ArrayExpression: isComplex,
    TaggedTemplateExpression: isComplex,
  });

  return complex;
}

function transformMemberExpression(expression, dynamicBinding, isDirective) {
  const { object, property, computed } = expression;
  let objectReplaceNode = object;
  let propertyReplaceNode = property;
  if (!object.__transformed) {
    // if object is ThisExpression, replace thw whole expression with _d0
    if (t.isThisExpression(object)) {
      const name = dynamicBinding.add({
        expression,
        isDirective
      });
      const replaceNode = t.identifier(name);
      replaceNode.__transformed = true;
      return replaceNode;
    }
    if (t.isIdentifier(object)) {
      const name = dynamicBinding.add({
        expression: object,
        isDirective
      });
      const replaceNode = t.identifier(name);
      replaceNode.__transformed = true;
      objectReplaceNode = replaceNode;
    }
    if (t.isMemberExpression(object)) {
      objectReplaceNode = transformMemberExpression(object, dynamicBinding, isDirective);
    }
  }

  if (!property.__transformed) {
    if (t.isMemberExpression(property)) {
      propertyReplaceNode = transformMemberExpression(property, dynamicBinding, isDirective);
    }
  }

  return t.memberExpression(objectReplaceNode, propertyReplaceNode, computed);
}

module.exports = {
  parse(parsed, code, options) {
    if (parsed.renderFunctionPath) {
      const { dynamicValues, dynamicEvents } = transformTemplate(parsed.templateAST, null, options.adapter, code, parsed.componentDependentProps);

      const dynamicValue = dynamicValues.reduce((prev, curr, vals) => {
        const name = curr.name || '_d' + (vals.length - 1);
        prev[name] = curr.value;
        return prev;
      }, {});
      Object.assign(parsed.dynamicValue, dynamicValue);

      const eventHandlers = parsed.eventHandlers = [];
      const dataProperties = [];
      const methodsProperties = [];
      dynamicEvents.forEach(({ name, value }) => {
        eventHandlers.push(name);
        methodsProperties.push(t.objectProperty(t.stringLiteral(name), value));
      });
      dynamicValues.forEach(({ name, value }) => {
        dataProperties.push(t.objectProperty(t.stringLiteral(name), value));
      });
      const updateData = t.memberExpression(
        t.thisExpression(),
        t.identifier('_updateData')
      );
      const updateMethods = t.memberExpression(
        t.thisExpression(),
        t.identifier('_updateMethods')
      );
      const fnBody = parsed.renderFunctionPath.node.body.body;
      fnBody.push(t.expressionStatement(t.callExpression(updateData, [
        t.objectExpression(dataProperties)
      ])));
      fnBody.push(t.expressionStatement(t.callExpression(updateMethods, [
        t.objectExpression(methodsProperties)
      ])));
    }
  },
  // For test export.
  _transform: transformTemplate,
};
