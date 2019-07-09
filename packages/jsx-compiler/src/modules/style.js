const t = require('@babel/types');
const traverse = require('../utils/traverseNodePath');

const TEMPLATE_AST = 'templateAST';
const DYNAMIC_STYLES = 'dynamicStyles';
const stylePrefix = '_s';

/**
 * Transform style object.
 *  input:  <view style={{width: 100}}/>
 *  output: <view style="{{_style0}}">
 *          var _style0 = { width: 100 };
 *          return { _style0 };
 */
function transformStyle(ast, dynamicStyles) {
  const dynamicValue = {};

  function getStyleName() {
    return stylePrefix + Object.keys(dynamicValue).length;
  }

  traverse(ast, {
    JSXAttribute(path) {
      const { node } = path;
      if (t.isJSXExpressionContainer(node.value) && node.name.name === 'style') {
        const styleObjectExpression = node.value.expression;

        // <tag style="{{ _s0 }}" />
        const styleName = getStyleName();
        node.value = t.stringLiteral('{{' + styleName + '}}');
        dynamicValue[styleName] = t.callExpression(t.identifier('__create_style__'), [styleObjectExpression]);
      }
    },
  });
  return dynamicValue;
}

module.exports = {
  parse(parsed, code, options) {
    const dynamicValue = transformStyle(parsed[TEMPLATE_AST]);

    if (Object.keys(dynamicValue).length > 0) {
      parsed.dynamicValue = Object.assign({}, parsed.dynamicValue, dynamicValue);
      parsed.useCreateStyle = true;
    }
  },

  _transform: transformStyle,
};
