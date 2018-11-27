const isValidIdentifier = require('is-valid-identifier');
const { getAndRemoveAttr, getBindingAttr } = require('sfc-compiler/src/helpers');
const { styleObjectName } = require('sfc-compiler/src/utils');

const parseStyleText = function(cssText) {
  const res = {};
  const listDelimiter = /;(?![^(]*\))/g;
  const propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function(item) {
    if (item) {
      let tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res;
};

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

function genData(el, state) {
  let data = '';

  if (!el.staticStyle && !el.styleBinding && !el.classNameStyle) {
    return data;
  }

  // _cx(styleBinding, staticStyle, ?styleObject, ?classNames);
  const styleBinding = el.styleBinding ? el.styleBinding : 'null';
  const staticStyle = el.staticStyle ? el.staticStyle : 'null';

  if (state.options && state.options.cssInJS) {
    const classNameStyle = el.classNameStyle ? el.classNameStyle : 'null';
    data += `style:_cx(${styleBinding},${staticStyle},${styleObjectName},${classNameStyle}),`;
  } else {
    data += `style:_cx(${styleBinding},${staticStyle}),`;
  }

  return data;
}

module.exports = {
  staticKeys: ['style'],
  transformNode,
  genData
};
