const t = require('@babel/types');
const traverse = require('../utils/traverseNodePath');
const genExpression = require('../codegen/genExpression');
const createBinding = require('../utils/createBinding');
const createJSXBinding = require('../utils/createJSXBinding');

function transformTemplate(ast, scope = null) {
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
    path.stop();

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
        if (node.expression.name === 'undefined') {
          path.replaceWith(t.stringLiteral(createBinding(node.expression.name)));
        } else if (isEventHandler(genExpression(parentPath.node.name))) {
          // <tag onClick={handleClick} />
          // => <tag onClick="_e0" />
          const id = applyEventHandler();
          dynamicValue[id] = node.expression;
          path.replaceWith(t.stringLiteral(id));
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

      // <tag foo={fn()} foo={fn.method()} foo={a ? 1 : 2} />
      // => <tag foo="{{_d0}}" foo="{{_d1}}" foo="{{_d2}}" />
      // return {
      //   _d0: fn(),
      //   _d1: fn.method(),
      //   _d1: a ? 1 : 2,
      // };
      case 'NewExpression':
      case 'CallExpression':
      case 'ObjectExpression':
      case 'ArrayExpression':
      case 'UnaryExpression':
      case 'ConditionalExpression':
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
        if (t.isIdentifier(node.expression, { name: 'undefined' })) {
          path.remove();
        } else {
          const value = node.expression.name || node.expression.value;
          path.replaceWith(createJSXBinding('' + value));
          // Only idenfitier should be listed in dynamic values.
          if (t.isIdentifier(node.expression)) dynamicValue[value] = node.expression;
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
        let exp = genExpression(node.expression);
        exp = exp
          .replace(/this.props./, '')
          .replace(/this.state./, '');
        path.replaceWith(createJSXBinding(exp));
        break;
      }


      // <tag foo={fn()} foo={fn.method()} foo={a ? 1 : 2} />
      // => <tag foo="{{_d0}}" foo="{{_d1}}" foo="{{_d2}}" />
      // return {
      //   _d0: fn(),
      //   _d1: fn.method(),
      //   _d1: a ? 1 : 2,
      // };
      case 'NewExpression':
      case 'CallExpression':
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
      case 'BinaryExpression':
      case 'LogicalExpression': {
        path.replaceWith(createJSXBinding(genExpression(node.expression)));
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
      if (parentPath.isJSXAttribute()) {
        transformAttr(path);
      } else if (parentPath.isJSXElement()) {
        transformElement(path);
      }
    },
  });

  return dynamicValue;
}

function isEventHandler(propKey) {
  return /^on[A-Z]/.test(propKey);
}

module.exports = {
  parse(parsed, code, options) {
    if (parsed.renderFunctionPath) {
      const dynamicValue = Object.assign({}, parsed.dynamicValue, transformTemplate(parsed.templateAST));
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
