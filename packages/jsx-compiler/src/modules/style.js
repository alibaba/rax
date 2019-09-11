const t = require('@babel/types');
const traverse = require('../utils/traverseNodePath');
const genExpression = require('../codegen/genExpression');
const TEMPLATE_AST = 'templateAST';
const DynamicBinding = require('../utils/DynamicBinding');

/**
 * Transform style object.
 *  input:  <view style={{width: 100}}/>
 *  output: <view style="{{_style0}}">
 *          var _style0 = { width: 100 };
 *          return { _style0 };
 */
function transformStyle(ast) {
  const dynamicValue = new DynamicBinding('_s');

  traverse(ast, {
    JSXAttribute(path) {
      const { node } = path;
      if (shouldReplace(path)) {
        const styleObjectExpression = node.value.expression;

        // <tag style="{{ _s0 }}" />
        const name = dynamicValue.add({
          expression: t.callExpression(t.identifier('__create_style__'), [styleObjectExpression]),
        });
        node.value = t.stringLiteral('{{' + name + '}}');
      }
    },
  });
  return dynamicValue.getStore();
}

function shouldReplace(path) {
  const { node } = path;
  if (t.isJSXExpressionContainer(node.value) && node.name.name === 'style') {
    let shouldReplace = true;
    // List item has been replaced in list module
    traverse(node.value.expression, {
      Identifier(innerPath) {
        if (innerPath.node.__listItem) {
          console.log(genExpression(node.value.expression))
          shouldReplace = false;
          innerPath.stop();
        }
      }
    });
    return shouldReplace;
  }
  return false;
}

module.exports = {
  parse(parsed, code, options) {
    const dynamicValues = transformStyle(parsed[TEMPLATE_AST]);
    const dynamicValue = dynamicValues.reduce((prev, curr, vals) => {
      const name = curr.name;
      prev[name] = curr.value;
      return prev;
    }, {});
    if (dynamicValues.length > 0) {
      parsed.dynamicValue = Object.assign({}, parsed.dynamicValue, dynamicValue);
      parsed.useCreateStyle = true;
    }
  },

  _transform: transformStyle,
};
