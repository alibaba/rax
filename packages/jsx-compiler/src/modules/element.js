const t = require('@babel/types');
const traverse = require('../utils/traverseNodePath');
const genExpression = require('../codegen/genExpression');
const createBinding = require('../utils/createBinding');
const createJSXBinding = require('../utils/createJSXBinding');

function transformTemplate(ast, scope = null, adapter) {
  const dynamicValue = {};

  let ids = 0;
  function applyDynamicValue() {
    return (scope ? scope : '') + '_d' + ids++;
  }

  let events = 0;
  function applyEventHandler() {
    return (scope ? scope : '') + '_e' + events++;
  }

  // Handle attributes.
  function transformAttr(path) {
    const { node, parentPath } = path;
    switch (node.expression.type) {
      // <tag key={'string'} />
      // => <tag key="string" />
      case 'StringLiteral': {
        path.replaceWith(t.stringLiteral(node.expression.value));
        break;
      }

      // <tag key={key} n={10} />
      // => <tag key="{{key}}" n="{{10}}" />
      case 'NumericLiteral':
      case 'BooleanLiteral': {
        const value = node.expression.name || node.expression.value;
        path.replaceWith(t.stringLiteral(createBinding(value)));
        break;
      }

      case 'NullLiteral': {
        path.replaceWith(t.stringLiteral(createBinding('null')));
        break;
      }

      case 'TemplateLiteral': {
        if (path.findParent(p => p && p.node && p.node.__isList)) {
          break;
        }

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
            dynamicValue[id] = nodes[i];
            retString += createBinding(id);
          }
        }

        path.replaceWith(t.stringLiteral(retString));
        break;
      }

      // <tag style={style} />
      // =>
      // <tag style="{{_d0}}" />
      case 'Identifier': {
        let skipIds;
        const hasSkipIdParentPath = path.findParent(p => p.isJSXElement() && p.node.skipIds);
        if (hasSkipIdParentPath) skipIds = hasSkipIdParentPath.node.skipIds;

        if (node.expression.name === 'undefined') {
          path.replaceWith(t.stringLiteral(createBinding(node.expression.name)));
        } else if (isEventHandler(genExpression(parentPath.node.name))) {
          // <tag onClick={handleClick} />
          // => <tag onClick="_e0" />
          const id = applyEventHandler();
          dynamicValue[id] = node.expression;
          path.replaceWith(t.stringLiteral(id));
        } else if (/^_l\d+/.test(node.expression.name) || skipIds && skipIds.has(node.expression.name)) {
          // 1. Ignore list variables.
          // 2. <View x-for={item in value} />
          path.replaceWith(t.stringLiteral(createBinding(node.expression.name)));
        } else {
          const id = applyDynamicValue();
          dynamicValue[id] = node.expression;
          path.replaceWith(t.stringLiteral(createBinding(id)));
        }
        break;
      }

      case 'MemberExpression': {
        if (isEventHandler(genExpression(parentPath.node.name))) {
          // <tag onClick={this.handleClick} />
          // => <tag onClick="_e0" />
          const id = applyEventHandler();
          dynamicValue[id] = node.expression;
          path.replaceWith(t.stringLiteral(id));
        } else {
          // <tag key={this.props.name} key2={a.b} />
          // => <tag key="{{name}}" key2="{{a.b}}" />
          let exp = genExpression(node.expression);
          exp = exp
            .replace(/this.props./, '')
            .replace(/this.state./, '');
          path.replaceWith(t.stringLiteral(createBinding(exp)));
        }

        break;
      }

      case 'CallExpression':
        if (
          isEventHandler(genExpression(parentPath.node.name))
          && t.isMemberExpression(node.expression.callee)
          && t.isIdentifier(node.expression.callee.property, { name: 'bind' })
        ) {
          const callExp = node.expression;
          const args = callExp.arguments;
          const attributes = parentPath.parentPath.node.attributes;
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
          const eventHandler = applyEventHandler();
          dynamicValue[eventHandler] = callExp.callee.object;
          path.replaceWith(t.stringLiteral(eventHandler));
          break;
        } else {
          // Fall through switch.
        }

      // <tag foo={fn()} foo={fn.method()} foo={a ? 1 : 2} />
      // => <tag foo="{{_d0}}" foo="{{_d1}}" foo="{{_d2}}" />
      // return {
      //   _d0: fn(),
      //   _d1: fn.method(),
      //   _d1: a ? 1 : 2,
      // };
      case 'ConditionalExpression':
        const { test } = node.expression;
        const elThatContainSkipIds = path.findParent(p => p.isJSXElement() && p.node.skipIds);
        const skipIds = elThatContainSkipIds
          && elThatContainSkipIds.node
          && elThatContainSkipIds.node.skipIds;
        if (t.isBinaryExpression(test)) {
          const { left, right } = test;
          if (t.isIdentifier(left) && !/^_l\d+/.test(left.name) && skipIds && !skipIds.has(left.name)) {
            const id = applyDynamicValue();
            dynamicValue[id] = Object.assign({}, left);
            test.left = t.identifier(id);
          }
          if (t.isIdentifier(right) && !/^_l\d+/.test(right.name) && skipIds && !skipIds.has(right.name)) {
            const id = applyDynamicValue();
            dynamicValue[id] = right;
            test.right = t.identifier(id);
          }
          path.replaceWith(t.stringLiteral(createBinding(genExpression(node.expression))));
          break;
        }
      case 'NewExpression':
      case 'ObjectExpression':
      case 'ArrayExpression':
      case 'UnaryExpression':
      case 'RegExpLiteral': {
        const id = applyDynamicValue();
        dynamicValue[id] = node.expression;
        path.replaceWith(t.stringLiteral(createBinding(id)));
        break;
      }

      // <tag onClick={() => {}} />
      // => <tag onClick="_e0" />
      case 'ArrowFunctionExpression':
      case 'FunctionExpression': {
        const id = applyEventHandler();
        dynamicValue[id] = node.expression;
        path.replaceWith(t.stringLiteral(id));
        break;
      }

      // <tag isFoo={a.length > 1} />
      // => <tag isFoo="{{a.length > 1}}" />
      case 'BinaryExpression':
      case 'LogicalExpression': {
        const elThatContainSkipIds = path.findParent(p => p.isJSXElement() && p.node.skipIds);
        const skipIds = elThatContainSkipIds
          && elThatContainSkipIds.node
          && elThatContainSkipIds.node.skipIds;
        traverse(node.expression, {
          Identifier(idPath) {
            const parentMem = idPath.findParent(p => p.isMemberExpression());
            if (parentMem && parentMem.node.object === idPath.node) {
              if (skipIds && !skipIds.has(idPath.node.name)) {
                dynamicValue[idPath.node.name] = idPath.node;
              } else if (!skipIds) {
                dynamicValue[idPath.node.name] = idPath.node;
              }
            } else if (!parentMem) {
              dynamicValue[idPath.node.name] = idPath.node;
            }
          },
        });
        path.replaceWith(t.stringLiteral(createBinding(genExpression(node.expression))));
        break;
      }

      // <tag isFoo={a,b} />
      // => <tag isFoo="{{b}}" />
      case 'SequenceExpression': {
        const { expressions } = node.expression;
        const exp = genExpression(expressions[expressions.length - 1]);
        path.replaceWith(t.stringLiteral(createBinding(exp)));
        break;
      }

      default: {
        throw new Error(
          'Unsupported stynax in JSX. ' + node.expression.type + ': "' + genExpression(node) + '"'
        );
      }
    }
  }

  // Handle elements.
  function transformElement(path) {
    const { node } = path;

    switch (node.expression.type) {
      // {'string'}
      // string
      case 'StringLiteral': {
        path.replaceWith(t.identifier(node.expression.value));
        break;
      }

      // {foo}
      // => {{ foo }}
      case 'NumericLiteral':
      case 'BooleanLiteral':
      case 'Identifier': {
        if (t.isIdentifier(node.expression) && path.findParent(p => p.isJSXElement() && p.node.skipIds && p.node.skipIds.has(node.expression.name))) {
          path.replaceWith(createJSXBinding(genExpression(node.expression)));
          break;
        }

        if (t.isIdentifier(node.expression, { name: 'undefined' })) {
          path.remove();
        } else {
          const value = node.expression.name || node.expression.value;
          path.replaceWith(createJSXBinding('' + value));
          // Only idenfitier should be listed in dynamic values.
          if (t.isIdentifier(node.expression) && !node.expression.__skipDynamicValue) {
            dynamicValue[value] = node.expression;
          }
        }
        break;
      }

      case 'NullLiteral': {
        path.remove();
        break;
      }

      // <tag key={this.props.name} key2={a.b} />
      // => <tag key="{{name}}" key2="{{a.b}}" />
      case 'MemberExpression': {
        const obj = node.expression.object;
        if (path.findParent(p => p.isJSXElement() && p.node.skipIds && p.node.skipIds.has(obj.name))) {
          path.replaceWith(createJSXBinding(genExpression(node.expression)));
          break;
        }

        if (t.isIdentifier(obj) && !/^_l\d+/.test(obj.name)) {
          const id = applyDynamicValue();
          dynamicValue[id] = obj;
          node.expression.object = t.identifier(id);
        }
        let exp = genExpression(node.expression);
        exp = exp
          .replace(/this.props./, '')
          .replace(/this.state./, '');
        path.replaceWith(createJSXBinding(exp));
        break;
      }

      case 'CallExpression':
        if (t.isMemberExpression(node.expression.callee)
          && t.isIdentifier(node.expression.callee.property, { name: 'map' })) {
          // Skip `array.map(iterableFunction)`.
          path.skip();
          break;
        } else {
          // Fall through
        }

      // <tag foo={fn()} foo={fn.method()} foo={a ? 1 : 2} />
      // => <tag foo="{{_d0}}" foo="{{_d1}}" foo="{{_d2}}" />
      // return {
      //   _d0: fn(),
      //   _d1: fn.method(),
      //   _d1: a ? 1 : 2,
      // };
      case 'NewExpression':
      case 'ArrayExpression':
      case 'UnaryExpression':
      case 'ConditionalExpression':
      case 'RegExpLiteral': {
        const id = applyDynamicValue();
        dynamicValue[id] = node.expression;
        path.replaceWith(createJSXBinding(id));
        break;
      }

      // <tag onClick={() => {}} />
      // => <tag onClick="_e0" />
      case 'ArrowFunctionExpression':
      case 'FunctionExpression': {
        const id = applyEventHandler();
        dynamicValue[id] = node.expression;
        path.replaceWith(createJSXBinding(id));
        break;
      }

      // <tag isFoo={a.length > 1} />
      // => <tag isFoo="{{a.length > 1}}" />
      case 'BinaryExpression': {
        path.replaceWith(createJSXBinding(genExpression(node.expression)));
        break;
      }

      case 'LogicalExpression': {
        if (node.expression.operator === '&&' && t.isJSXElement(node.expression.right)) {
          // foo && <Element />
          node.expression.right.openingElement.attributes.push(t.jsxAttribute(
            t.jsxIdentifier(adapter.if),
            t.stringLiteral(createBinding(genExpression(node.expression.left)))
          ));
          traverse(node.expression.left, {
            MemberExpression(path) {
              dynamicValue[path.node.object.name] = path.node.object;
              path.skip();
            },
            Identifier(path) {
              if (!path.node.__skipDynamicValue) {
                dynamicValue[path.node.name] = path.node;
              }
            },
          });
          path.replaceWith(node.expression.right);
        } else {
          path.replaceWith(createJSXBinding(genExpression(node.expression)));
        }
        break;
      }

      // <tag isFoo={a,b} />
      // => <tag isFoo="{{b}}" />
      case 'SequenceExpression': {
        const { expressions } = node.expression;
        const exp = genExpression(expressions[expressions.length - 1]);
        path.replaceWith(createJSXBinding(exp));
        break;
      }

      // Special to avoid loop.
      case 'JSXEmptyExpression':
        path.remove();
        break;

      // {<div></div>} => <div></div>
      case 'JSXElement':
        path.replaceWith(node.expression);
        break;

      case 'ObjectExpression':
        break;

      default: {
        throw new Error(
          'Unsupported stynax in JSX. ' + node.expression.type + ': "' + genExpression(node) + '"'
        );
      }
    }
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
    JSXExpressionContainer(path) {
      const { parentPath } = path;
      // <View foo={bar} />
      if (parentPath.isJSXAttribute()) {
        transformAttr(path);
      } else if (parentPath.isJSXElement()) {
        // <View>{xxx}</View>
        transformElement(path);
      }
    }
  });

  return dynamicValue;
}

function isEventHandler(propKey) {
  return /^on[A-Z]/.test(propKey);
}

module.exports = {
  parse(parsed, code, options) {
    if (parsed.renderFunctionPath) {
      const dynamicValue = Object.assign({}, parsed.dynamicValue, transformTemplate(parsed.templateAST, null, options.adapter));
      const eventHandlers = parsed.eventHandlers = [];
      const properties = [];
      Object.keys(dynamicValue).forEach((key) => {
        if (/_e\d+$/.test(key)) {
          eventHandlers.push(key);
        }
        properties.push(t.objectProperty(t.stringLiteral(key), dynamicValue[key]));
      });
      parsed.renderFunctionPath.node.body.body.push(
        t.returnStatement(t.objectExpression(properties))
      );
    }
  },
  // For test export.
  _transform: transformTemplate,
};
