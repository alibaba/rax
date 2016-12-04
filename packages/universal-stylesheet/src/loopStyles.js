/* global __DEV__ */

const isDev = typeof __DEV__ === 'boolean' && __DEV__;
import StyleSheetValidation from './StyleSheetValidation';

let loopStyles = function(styles, parentStyle = {}) {
  let result = {};
  for (let className in styles) {
    let style = styles[className];
    if (typeof style === 'object') {
      if (isDev) {
        StyleSheetValidation.validateStyle(className, styles);
      }
      result[className] = loopStyles(style, styles);
    } else {
      result[className] = style;
    }
  }
  return result;
};

export default loopStyles;
