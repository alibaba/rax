const t = require('@babel/types');
const traverse = require('../utils/traverseNodePath');
const genExpression = require('../codegen/genExpression');
const createBinding = require('../utils/createBinding');
const createJSXBinding = require('../utils/createJSXBinding');
const CodeError = require('../utils/CodeError');

const ATTR = Symbol('attribute');
const ELE = Symbol('element');
/**
 * 1. Normalize jsxExpressionContainer to binding var.
 * 2. Collect dynamicValue (dependent identifiers)
 * 3. Normalize function bounds.
 * @param ast
 * @param scope
 * @param adapter
 * @param sourceCode
 */
function transformTemplate(ast, scope = null, adapter, sourceCode) {
  const dynamicValues = [];
  const dynamicEvents = [];
  const applyDynamicValueName = () => '_d' + dynamicValues.length;
  const applyDynamicEventName = () => '_e' + dynamicEvents.length;

  function handleJSXExpressionContainer(path) {
    const { parentPath, node } = path;
    if (node.__transformed) return;

    const type = parentPath.isJSXAttribute()
      ? ATTR // <View foo={bar} />
      : ELE; // <View>{xxx}</View>
    const { expression } = node;

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
        const dynamicName = applyDynamicValueName();
        if (type === ATTR) {
          path.replaceWith(t.stringLiteral(createBinding(dynamicName)));
        } else if (type === ELE) {
          path.replaceWith(createJSXBinding(dynamicName));
        }
        dynamicValues.push({
          name: dynamicName,
          value: expression,
        });
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
            const id = genExpression(nodes[i], { concise: true });
            dynamicValues.push({
              name: id,
              value: nodes[i],
            });
            retString += createBinding(id);
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
          } else {
            path.replaceWith(t.stringLiteral(createBinding(expression.name)));
          }
        } else if (type === ELE) {
          if (expression.name === 'undefined') {
            path.remove(); // Remove expression
            break;
          } else {
            path.replaceWith(createJSXBinding(expression.name));
          }
        }
        dynamicValues.push({
          name: expression.name,
          value: expression,
        });
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

        if (!isEventHandler(parentPath.node.name.name)) throw new CodeError(sourceCode, node, node.loc, `Only EventHandlers are supported in Mini Program, eg: onClick/onChange, instead of "${parentPath.node.name.name}".`);

        const name = applyDynamicEventName();
        dynamicEvents.push({ name, value: expression });
        path.replaceWith(t.stringLiteral(name));
        break;

      // <tag key={this.props.name} key2={a.b} /> => <tag key="{{name}}" key2="{{a.b}}" />
      // <tag>{ foo.bar }</tag> => <tag>{{ foo.bar }}</tag>
      case 'MemberExpression':
        if (type === ATTR) {
          if (isEventHandler(parentPath.node.name.name)) {
            const name = applyDynamicEventName();
            dynamicEvents.push({
              name,
              value: expression
            });
            path.replaceWith(t.stringLiteral(name));
          } else {
            const name = applyDynamicValueName();
            dynamicValues.push({
              name,
              value: expression
            });
            path.replaceWith(t.stringLiteral(createBinding(name)));
          }
        } else if (type === ELE) {
          const name = applyDynamicValueName();
          dynamicValues.push({
            name,
            value: expression
          });
          path.replaceWith(createJSXBinding(name));
        }
        break;

      // <tag foo={fn()} /> => <tag foo="{{_d0}} /> _d0 = fn();
      // <tag>{fn()}</tag> => <tag>{{ _d0 }}</tag> _d0 = fn();
      case 'CallExpression':
        if (type === ATTR) {
          if (
            isEventHandler(parentPath.node.name.name)
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
            const name = applyDynamicEventName();
            dynamicEvents.push({
              name, value: callExp.callee.object
            });
            path.replaceWith(t.stringLiteral(name));
          } else {
            const name = applyDynamicValueName();
            dynamicValues.push({
              name, value: expression
            });
            path.replaceWith(t.stringLiteral(createBinding(name)));
          }
        } else if (type === ELE) {
          // Skip `array.map(iterableFunction)`.
          const name = applyDynamicValueName();
          dynamicValues.push({
            name, value: expression
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
        if (templateSupportedExpression(path)) {
          if (type === ATTR) path.replaceWith(t.stringLiteral(createBinding(genExpression(expression))));
          else if (type === ELE) path.replaceWith(createJSXBinding(genExpression(expression)));
        } else {
          const name = applyDynamicValueName();
          dynamicValues.push({
            name, value: expression,
          });
          if (type === ATTR) path.replaceWith(t.stringLiteral(createBinding(name)));
          else if (type === ELE) path.replaceWith(createJSXBinding(name));
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

  return { dynamicValues, dynamicEvents };
}

function isEventHandler(propKey) {
  return /^on[A-Z]/.test(propKey);
}

function templateSupportedExpression(path) {
  let supported = true;
  if (path.isCallExpression()) return false;
  if (path.isTemplateLiteral()) return false;
  if (path.isUnaryExpression()) return false;

  function unsupported(p) {
    supported = false;
    p.stop();
  }
  traverse(path, {
    NewExpression: unsupported,
    CallExpression: unsupported,
    UnaryExpression: unsupported,
    TemplateLiteral: unsupported,
    // It's hard to process objectExpression nested, same as arrayExp.
    ObjectExpression: unsupported,
    ArrayExpression: unsupported,
    TaggedTemplateExpression: unsupported,
    MemberExpression(p) {
      const { parentPath } = p;
      const jsxExpContainer = p.findParent(_ => _.isJSXExpressionContainer());
      const object = p.get('object');
      const property = p.get('property');
      if (
        jsxExpContainer
        && object.isThisExpression()
        && property.isIdentifier({ name: 'state' })
        && parentPath.isMemberExpression()
        && parentPath.parentPath.isMemberExpression()
      ) {
        const sourceCode = parentPath.parentPath.getSource();
        if (sourceCode.includes('[') && sourceCode.includes(']')) {
          unsupported(p);
        }
      }
    }
  });

  return supported;
}

module.exports = {
  parse(parsed, code, options) {
    if (parsed.renderFunctionPath) {
      const { dynamicValues, dynamicEvents } = transformTemplate(parsed.templateAST, null, options.adapter, code);

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
