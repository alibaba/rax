/* global __DEV__ */
'use strict';

const isDev = typeof __DEV__ === 'boolean' && __DEV__;
import TextStylePropTypes from './validation/TextStylePropTypes';
import ViewStylePropTypes from './validation/ViewStylePropTypes';
import WeexProps from './validation/WeexProps';

let allStylePropTypes = {};

class StyleSheetValidation {
  static validateStyleProp(prop, style, caller) {
    if (!isDev || typeof style[prop] === 'object') {
      return;
    }

    // not support for weex
    if (WeexProps.noSupport.indexOf(prop) > -1) {
      let message1 = `"${prop}" is %cnot support for Weex.`;
      styleError(message1, 'color: red; font-size: 15px');
      console.log('view doc：http://alibaba.github.io/weex/doc/references/common-style.html');
    }

    // only support for weex
    if (WeexProps.particular.indexOf(prop) > -1) {
      let message1 = `"${prop}" is only support for Weex.`;
      styleError(message1);
      return;
    }

    if (allStylePropTypes[prop] === undefined) {
      let message1 = `"${prop}" is not a valid style property.`;
      let message2 = '\nValid style props: ' +
        JSON.stringify(Object.keys(allStylePropTypes).sort(), null, '  ');
      styleError(message1);
      return;
    }

    let error = allStylePropTypes[prop](style, prop, caller, 'prop');

    if (error) {
      styleError(error.message);
    }
  }

  static validateStyle(name, styles) {
    if (!isDev) {
      return;
    }
    for (const prop in styles[name]) {
      StyleSheetValidation.validateStyleProp(prop, styles[name], 'StyleSheet ' + name);
    }
  }

  static addValidStylePropTypes(stylePropTypes) {
    for (const key in stylePropTypes) {
      allStylePropTypes[key] = stylePropTypes[key];
    }
  }
}

const styleError = function(message1, css?) {
  if (css) {
    console.warn(message1 + '\n', css);
  } else {
    console.warn(message1 + '\n');
  }
};

StyleSheetValidation.addValidStylePropTypes(TextStylePropTypes);
StyleSheetValidation.addValidStylePropTypes(ViewStylePropTypes);

export default StyleSheetValidation;
