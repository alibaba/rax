const t = require('@babel/types');
const traverse = require('../utils/traverseNodePath');
const genExpression = require('../codegen/genExpression');
const createBinding = require('../utils/createBinding');

function transformAttrs(ast) {
  let ids = 0;
  function applyId() {
    return '_dynamicVal' + ids++;
  }

  let events = 0;
  function applyEvent() {
    return '_event' + events++;
  }

  const dynamicValue = {};
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
      const { node, parentPath } = path;
      // Only process under JSXAttribute
      if (!parentPath.isJSXAttribute()) return;

      switch (node.expression.type) {
        case 'StringLiteral': {
          path.replaceWith(t.stringLiteral(node.expression.value));
          break;
        }

        // <tag key={key} n={10} />
        // => <tag key="{{key}}" n="{{10}}" />
        case 'NumericLiteral':
        case 'BooleanLiteral':
        case 'Identifier': {
          const value = node.expression.name || node.expression.value;
          path.replaceWith(t.stringLiteral(createBinding(value)));
          break;
        }

        case 'NullLiteral': {
          path.replaceWith(t.stringLiteral(createBinding('null')));
          break;
        }

        // <tag key={this.props.name} key2={a.b} />
        // => <tag key="{{name}}" key2="{{a.b}}" />
        case 'MemberExpression': {
          let exp = genExpression(node.expression);
          exp = exp
            .replace(/this.props./, '')
            .replace(/this.state./, '');
          path.replaceWith(t.stringLiteral(createBinding(exp)));
          break;
        }


        // <tag foo={fn()} foo={fn.method()} foo={a ? 1 : 2} />
        // => <tag foo="{{_dynamicVal0}}" foo="{{_dynamicVal1}}" foo="{{_dynamicVal2}}" />
        // return {
        //   _dynamicVal0: fn(),
        //   _dynamicVal1: fn.method(),
        //   _dynamicVal1: a ? 1 : 2,
        // };
        case 'NewExpression':
        case 'CallExpression':
        case 'ObjectExpression':
        case 'ArrayExpression':
        case 'UnaryExpression':
        case 'ConditionalExpression':
        case 'RegExpLiteral': {
          const id = applyId();
          dynamicValue[id] = node.expression;
          path.replaceWith(t.stringLiteral(createBinding(id)));
          break;
        }

        // <tag onClick={() => {}} />
        // => <tag onClick="_event0" />
        case 'ArrowFunctionExpression':
        case 'FunctionExpression': {
          const id = applyEvent();
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
    },

  });

  return dynamicValue;
}

module.exports = {
  parse(parsed, code, options) {
    const dynamicValue = transformAttrs(parsed.templateAST);
    const properties = [];
    Object.keys(dynamicValue).forEach((key) => {
      properties.push(t.objectProperty(t.identifier(key), dynamicValue[key]));
    });
    parsed.renderFunctionPath.node.body.body.push(
      t.returnStatement(t.objectExpression(properties))
    );
  },
  // For test export.
  _transformAttrs: transformAttrs,
};
