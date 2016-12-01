'use strict';

import unitNormalize from './unitNormalize';
import calcPercent from './calcPercent';

const processors = [calcPercent, unitNormalize];

const applyProcessors = (prop, value) => processors.reduce((value, processor) => processor(prop, value), value);

function compile(styles, styleData) {
  let result = {};

  for (const className in styles) {
    let style = styles[className];
    if (typeof style === 'object') {
      result[className] = createStyle(style, styleData);
    } else {
      if (styleData) {
        if (style[0] && style[0] === '$' && typeof styleData[style.substring(1)] !== 'undefined') {
          style = styleData[style.substring(1)];
        }
      }
      result[className] = applyProcessors(className, style);
    }
  }
  return result;
};

export function createStyle(styles) {
  return compile(styles);
};

export function buildStyle(styles, styleData) {
  return compile(styles, styleData);
};
