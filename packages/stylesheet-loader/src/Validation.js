'use strict';

import BoxModelPropTypes from './BoxModelPropTypes';
import FlexboxPropTypes from './FlexboxPropTypes';
import TextStylePropTypes from './TextStylePropTypes';
import ColorPropTypes from './ColorPropTypes';
import {pushWarnMessage} from './promptMessage';
import particular from './particular';
import chalk from 'chalk';

class Validation {
  static validate(prop, value) {
    if (allStylePropTypes[prop]) {
      let error = allStylePropTypes[prop](value, prop);

      if (error) {
        console.warn(chalk.yellow.bold(error.message));
        pushWarnMessage(error.message);
      }
      return error;
    } else {
      if (!particular[prop]) {
        const message = `\`${prop}\` is not a valid property in the flexbox specification (https://www.w3.org/TR/css-flexbox-1/)`;
        console.warn(chalk.yellow.bold(message));
        pushWarnMessage(message);
      }
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
