'use strict';

import normalizeColor from './normalizeColor';

let colorPropType = function(isRequired, props, propName, componentName, propFullName) {
  let color = props[propName];
  if (color === undefined || color === null) {
    if (isRequired) {
      return new Error(
        `Required  \`${propFullName || propName}\` was not specified in \`${componentName}\`.`
      );
    }
    return;
  }

  if (typeof color === 'number') {
    return;
  }

  if (normalizeColor(color) === null) {
    return new Error(
      `Invalid  \`${propFullName || propName}\` supplied to \`${componentName}\`: ${color}`
    );
  }
};

let ColorPropType = colorPropType.bind(null, false);
ColorPropType.isRequired = colorPropType.bind(null, true);

export default ColorPropType;
