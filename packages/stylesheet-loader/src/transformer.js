'use strict';

import camelCase from 'camelcase';
import normalizeColor from './normalizeColor';
import particular from './particular';
import Validation from './Validation';
import {pushErrorMessage} from './promptMessage';
import chalk from 'chalk';

const QUOTES_REG = /[\\'|\\"]/g;

const COLOR_PROPERTIES = {
  color: true,
  backgroundColor: true,
  borderColor: true,
  borderBottomColor: true,
  borderTopColor: true,
  borderRightColor: true,
  borderLeftColor: true
};

export default {
  sanitizeSelector(selector, transformDescendantCombinator = false, position = { start: {line: 0, column: 0} }) {
    // filter multiple extend selectors
    if (!transformDescendantCombinator && !/^\.[a-zA-Z0-9_:\-]+$/.test(selector)) {
      const message = `line: ${position.start.line}, column: ${position.start.column} - "${selector}" is not a valid selector (e.g. ".abc、.abcBcd、.abc_bcd")`;
      console.error(chalk.red.bold(message));
      pushErrorMessage(message);
      return null;
    }
    return selector.replace(/\s/gi, '_').replace(/[\.]/g, '');
  },

  convertProp(prop) {
    let result = camelCase(prop);

    // Handle vendor prefixes
    if (prop.indexOf('-webkit') === 0) {
      result = result.replace('webkit', 'Webkit');
    } else if (prop.indexOf('-moz') === 0) {
      result = result.replace('moz', 'Moz');
    }

    return result;
  },

  convertValue(property, value) {
    var result = value,
      resultNumber;

    if (!Number.isNaN(Number(result))) {
      result = Number(result);
    }

    if (COLOR_PROPERTIES[property]) {
      result = normalizeColor(value);
    }

    return result;
  },

  convert(rule) {
    let style = {};

    if (rule.tagName === 'text') {
      return;
    }

    rule.declarations.forEach((declaration) => {
      if (declaration.type !== 'declaration') {
        return;
      }
      declaration.value = declaration.value.replace(QUOTES_REG, '');
      let camelCaseProperty = this.convertProp(declaration.property);
      let value = this.convertValue(camelCaseProperty, declaration.value);
      style[camelCaseProperty] = value;

      Validation.validate(camelCaseProperty, declaration.property, declaration.value, rule.selectors.join(', '), declaration.position);
      if (particular[camelCaseProperty]) {
        let particularResult = particular[camelCaseProperty](value);
        if (particularResult.isDeleted) {
          style[camelCaseProperty] = null;
          delete style[camelCaseProperty];
          delete particularResult.isDeleted;
        }
        Object.assign(style, particularResult);
      }
    });

    return style;
  }
};
