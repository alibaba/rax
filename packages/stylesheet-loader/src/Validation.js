'use strict';

import BoxModelPropTypes from './BoxModelPropTypes';
import FlexboxPropTypes from './FlexboxPropTypes';
import TextStylePropTypes from './TextStylePropTypes';
import ColorPropTypes from './ColorPropTypes';
import chalk from 'chalk';

class Validation {
  static validate(prop, value) {
    if (allStylePropTypes[prop]) {
      let error = allStylePropTypes[prop](value, prop);

      if (error) {
        console.warn(chalk.yellow.bold(error.message));
      }
      return error;
    }
  }

  static addValidStylePropTypes(stylePropTypes) {
    for (let prop in stylePropTypes) {
      allStylePropTypes[prop] = stylePropTypes[prop];
    }
  }
}

let allStylePropTypes = {};

Validation.addValidStylePropTypes(BoxModelPropTypes);
Validation.addValidStylePropTypes(FlexboxPropTypes);
Validation.addValidStylePropTypes(TextStylePropTypes);
Validation.addValidStylePropTypes(ColorPropTypes);

export default Validation;
