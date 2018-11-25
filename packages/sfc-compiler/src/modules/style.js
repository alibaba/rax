const isValidIdentifier = require('is-valid-identifier');
const { parseStyleText } = require('../utils/style');
const { getAndRemoveAttr, getBindingAttr } = require('../helpers');

function transformNode(el, options) {
  // <view style="color: red;" />
  const staticStyle = getAndRemoveAttr(el, 'style');
  if (staticStyle) {
    // { "color": "red" }
    el.staticStyle = JSON.stringify(parseStyleText(staticStyle));
  }

  /**
   * <view :style="styleObject" />
   * or
   * <view :style="{ color: 'red' }" />
   */
  const styleBinding = getBindingAttr(el, 'style', false /* getStatic */);
  if (styleBinding) {
    el.styleBinding = isValidIdentifier(styleBinding) ? 'this.' + styleBinding : styleBinding;
  }
}

function genData(el) {
  let data = '';
  if (!el.staticStyle && !el.styleBinding) {
    return data;
  }

  // _cx(styleBinding, staticStyle);
  const styleBinding = el.styleBinding ? el.styleBinding : 'null';
  const staticStyle = el.staticStyle ? el.staticStyle : 'null';
  data += `style:_cx(${styleBinding},${staticStyle}),`;

  return data;
}

module.exports = {
  staticKeys: ['style'],
  transformNode,
  genData
};
