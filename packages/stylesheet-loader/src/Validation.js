'use strict';

import BoxModelPropTypes from './BoxModelPropTypes';
import FlexboxPropTypes from './FlexboxPropTypes';
import TextStylePropTypes from './TextStylePropTypes';
import ColorPropTypes from './ColorPropTypes';
import {pushWarnMessage} from './promptMessage';
import particular from './particular';
import chalk from 'chalk';

class Validation {
  static validate(camelCaseProperty, prop, value, selectors = '', position = {}) {
    if (allStylePropTypes[camelCaseProperty]) {
      let error = allStylePropTypes[camelCaseProperty](value, prop, selectors);

      if (error) {
        const message = `line: ${position.start.line}, column: ${position.start.column} - ${error.message}`;
        console.warn(chalk.yellow.bold(message));
        pushWarnMessage(message);
      }
      return error;
    } else {
      if (!particular[camelCaseProperty]) {
        const message = `line: ${position.start.line}, column: ${position.start.column} - "${prop}: ${value}" is not valid in "${selectors}" selector`;
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
