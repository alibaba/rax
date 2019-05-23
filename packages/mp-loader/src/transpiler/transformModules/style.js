const { getAndRemoveAttr } = require('../helpers');
const expressionHelpers = require('../expression');

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
};

function genData(el) {
  if (el.staticStyle || el.styleBinding) {
    const styleBinding = el.styleBinding ? el.styleBinding : 'null';
    const staticStyle = el.staticStyle ? el.staticStyle : 'null';
    return `style:_cx(${styleBinding},${staticStyle}),`;
  } else {
    return '';
  }
}

module.exports = {
  staticKeys: ['style'],
  transformNode,
  genData,
};
