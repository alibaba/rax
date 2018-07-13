const { getAndRemoveAttr } = require('../helpers');
const expressionHelpers = require('../expression');
const IS_BIND_REG = /\W*\{\{/;

/**
 * transpile class
 * @param {*} attr
 * @param {*} itemKey
 * @param {*} indexKey
 */
function transformNode(node) {
  const { attrsMap, attrsList } = node;
  if (attrsMap && attrsMap.hasOwnProperty('class')) {
    if (IS_BIND_REG.test(attrsMap.class)) {
      const exp = getAndRemoveAttr(node, 'class');
      node.classNameStyle = exp;
    } else {
      node.classNameStyle = JSON.stringify([attrsMap.class]);
    }
  }
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
  transformNode
};
