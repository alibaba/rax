const t = require('@babel/types');
const traverse = require('../utils/traverseNodePath');

const TEMPLATE_AST = 'templateAST';
const DYNAMIC_STYLES = 'dynamicStyles';
const stylePrefix = '_style';

function getStyleName(dynamicStyles) {
  return stylePrefix + dynamicStyles.length;
}

/**
 * Transform style object.
 *  input:  <view style={{width: 100}}/>
 *  output: <view style="{{_style0}}">
 *          var _style0 = { width: 100 };
 *          return { _style0 };
 */
function transformStyle(ast, dynamicStyles) {
  traverse(ast, {
    JSXAttribute(path) {
      const { node } = path;
      if (
        t.isJSXExpressionContainer(node.value)
        && node.name.name === 'style'
        && (
          t.isArrayExpression(node.value.expression)
          || t.isObjectExpression(node.value.expression)
        )) {
        let styleObjectExpression = node.value.expression;

        if (t.isArrayExpression(styleObjectExpression)) {
          let properties = [];
          styleObjectExpression.elements.forEach((ele) => {
            properties = properties.concat(ele.properties);
          });
          styleObjectExpression = {
            type: 'ObjectExpression',
            properties,
          };
        }

        const styleName = getStyleName(dynamicStyles);
        dynamicStyles.push(styleObjectExpression);

        // <tag style="{{_style0}}" />
        node.value = t.stringLiteral('{{' + styleName + '}}');
      }
    },
  });
}

module.exports = {
  parse(parsed, code, options) {
    const dynamicStyles = [];
    transformStyle(parsed[TEMPLATE_AST], dynamicStyles);

    parsed[DYNAMIC_STYLES] = dynamicStyles;
  },
};
