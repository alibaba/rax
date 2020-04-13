const t = require('@babel/types');
const traverse = require('../utils/traverseNodePath');

const TEMPLATE_AST = 'templateAST';
const DynamicBinding = require('../utils/DynamicBinding');
const getListItem = require('../utils/getListItem');
const isSlotScopeNode = require('../utils/isSlotScopeNode');

/**
 * Transform style object.
 *  input:  <view style={{width: 100}}/>
 *  output: <view style="{{_style0}}">
 *          var _style0 = { width: 100 };
 *          return { _style0 };
 */
function transformStyle(ast, adapter) {
  const dynamicStyle = new DynamicBinding('s');
  let useCreateStyle = false;
  traverse(ast, {
    JSXAttribute(path) {
      const { node } = path;
      if (shouldReplace(path)) {
        const styleObjectExpression = node.value.expression;
        // <tag style="{{ _s0 }}" />
        const name = dynamicStyle.add({
          expression: t.callExpression(t.identifier('__create_style__'), [styleObjectExpression]),
        });
        node.value = t.stringLiteral('{{' + name + '}}');
        // Record original expression
        node.value.__originalExpression = styleObjectExpression;
        useCreateStyle = true;
      }
    },
  });
  return {
    useCreateStyle,
    dynamicStyle
  };
}

function shouldReplace(path) {
  const { node } = path;
  if (t.isJSXExpressionContainer(node.value) && node.name.name === 'style') {
    return !(getListItem(node.value.expression) || isSlotScopeNode(node.value.expression));
  }
  return false;
}

module.exports = {
  parse(parsed, code, options) {
    const { useCreateStyle, dynamicStyle } = transformStyle(parsed[TEMPLATE_AST], options.adapter);
    if (!parsed.useCreateStyle) {
      parsed.useCreateStyle = useCreateStyle;
    }
    // Set global dynamic style value
    parsed.dynamicStyle = dynamicStyle;
  },

  _transform: transformStyle,
};
