const { getAndRemoveAttr } = require('../helpers');
const expressionHelpers = require('../expression');

/**
 * Transform style
 */
function transformNode(node) {
  const { attrsMap } = node;
  if (attrsMap && attrsMap.hasOwnProperty('style')) {
    const styleExp = attrsMap.style;
    getAndRemoveAttr(node, 'style');

    if (expressionHelpers.hasExpression(styleExp)) {
      const jsExp = expressionHelpers.transformExpression(styleExp);
      // a trik: 不添加 `this.`
      node.styleBinding = ' ' + jsExp;
    } else {
      node.staticStyle = JSON.stringify(styleExp);
    }
  }
}

module.exports = {
  transformNode,
};
